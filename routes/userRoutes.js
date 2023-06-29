const express = require('express');
const controller = require('../controllers/userControllers');
const authController = require('../controllers/authController')
const router = express.Router();


router.post('/signup', authController.signUp)
router.route('/').get(controller.getAllUsers).post(controller.createUser);
router
  .route('/:id')
  .get(controller.getUser)
  .patch(controller.updateUser)
  .delete(controller.deleteUser);

module.exports = router;
