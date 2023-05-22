const express = require('express');
const controller = require('../controllers/userControllers');

const router = express.Router();

router.route('/').get(controller.getAllUsers).post(controller.createUser);
router
  .route('/:id')
  .get(controller.getUser)
  .patch(controller.updateUser)
  .delete(controller.deleteUser);

module.exports = router;
