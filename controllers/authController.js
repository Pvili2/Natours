const User = require('../models/userModel');
const AppError = require('../utils/AppError')
const catchAsync = require('../utils/catchAsync')
const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs")


const generateToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_secret, { expiresIn: process.env.JWT_expires_in })
}

const signUp = catchAsync(async (req, res) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });
    //create token
    const token = generateToken(user);

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
    const passwordAuth = await bcrypt.compare(password, log[0]?.password || "");
    if (log.length === 0 || !passwordAuth) return next(new AppError('Email or password is not correct', 401))
    //3) If everything is correct, send JWT to the client
    const token = generateToken(log);
    res.status(200).json({
        status: 'success',
        token,
    })
})

module.exports = {
    signUp,
    login
}