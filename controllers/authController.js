const util = require('util');
const User = require('../models/userModel');
const AppError = require('../utils/AppError')
const catchAsync = require('../utils/catchAsync')
const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs");
const { request } = require('http');


const generateToken = (user) => {
    return jwt.sign({ id: user[0]._id }, process.env.JWT_secret, { expiresIn: process.env.JWT_expires_in })
}

const signUp = catchAsync(async (req, res) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role
    });
    console.log(user);
    //create token
    const token = generateToken([user]);

    res.status(200).json({
        status: 'success',
        token,
        data: { user },
    });
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    //1) Check if email and password are exist
    if (!email || !password) return next(new AppError('Email or password not found', 404))
    //2) Check if user is exits && password is correct

    const log = await User.find({ email }).select('email password _id');
    const passwordAuth = await bcrypt.compare(password, log[0].password);
    if (log.length === 0 || !passwordAuth) return next(new AppError('Email or password is not correct', 401))
    //3) If everything is correct, send JWT to the client
    const token = generateToken(log);
    res.status(200).json({
        status: 'success',
        token,
    })
})

const protect = catchAsync(async (req, res, next) => {
    //1) Check if the user have an access token
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('You have no access token, please log in', 401))
    }
    //2) Verification token
    const verify = await util.promisify(jwt.verify)(token, process.env.JWT_secret);
    //3) Check if user still exists

    const user = await User.findById(verify.id);
    if (!user) return next(new AppError('This user is not exists anymore', 401))
    //4) Check if user changed password after the JWT was issued
    if (user.changedPasswordAfter(verify.iat)) {
        return next(new AppError('The password is changed, please log again', 401))
    }


    req.body = user;
    next();
})
//We don't know how many parameters we need in the future, so we can specify this in this way(roles is an array)
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.body.role)) return next(new AppError("You don't have peprmission to access", 403)) //forbidden
        next();
    }

}

const forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Identify the user from the req.body.email
    const user = await User.findOne({ email: req.body.email })
    if (!user) return next(new AppError('User not found', 404))
    // 2) Generate random reset token
    const resetToken = user.createPasswordResetToken();

    //We need to save the "user" because in the "createPasswordResetToken" method is set a few field in our doc
    await user.save({ validateBeforeSave: false });
    console.log(user)
    // 3) Send it back to the users email
})

const resetPassword = (req, res, next) => {

}
module.exports = {
    signUp,
    login,
    protect,
    restrictTo,
    forgotPassword,
    resetPassword
}