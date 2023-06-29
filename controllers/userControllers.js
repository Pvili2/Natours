const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync')


const getAllUsers = (req, res) => {
  res.status(501).json({
    status: 'error',
    data: { message: 'This endpoint not implemented yet!' },
  }); //500 means server error
};
const createUser = catchAsync(async (req, res) => {
  const user = await User.create(req.body);
  res.status(200).json({
    status: 'success',
    data: { user },
  });
});
const getUser = (req, res) => {
  res.status(501).json({
    status: 'error',
    data: { message: 'This endpoint not implemented yet!' },
  });
};
const updateUser = (req, res) => {
  res.status(501).json({
    status: 'error',
    data: { message: 'This endpoint not implemented yet!' },
  });
};
const deleteUser = (req, res) => {
  res.status(501).json({
    status: 'error',
    data: { message: 'This endpoint not implemented yet!' },
  });
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
