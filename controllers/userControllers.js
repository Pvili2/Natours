const getAllUsers = (req, res) => {
  res.status(501).json({
    status: 'error',
    data: { message: 'This endpoint not implemented yet!' },
  }); //500 means server error
};
const createUser = (req, res) => {
  res.status(501).json({
    status: 'error',
    data: { message: 'This endpoint not implemented yet!' },
  });
};
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
