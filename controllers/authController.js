const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync')
const jwt = require('jsonwebtoken')

const signUp = catchAsync(async (req, res) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });
    //create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_secret, { expiresIn: process.env.JWT_expires_in })

    res.status(200).json({
        status: 'success',
        token,
        data: { user },
    });
});

module.exports = {
    signUp
}