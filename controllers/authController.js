const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync')

const signUp = catchAsync(async (req, res) => {
    const user = await User.create(req.body);
    res.status(200).json({
        status: 'success',
        data: { user },
    });
});

module.exports = {
    signUp
}