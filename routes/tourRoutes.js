const fs = require('fs');
const express = require('express');
const controller = require('../controllers/tourControllers');
const router = express.Router();

router.param('id', controller.checkId);

router.route('/').get(controller.getAllTours).post(controller.createTour);
router
  .route('/:id')
  .get(controller.getTour)
  .patch(controller.updateTour)
  .delete(controller.deleteTour);

module.exports = router;
