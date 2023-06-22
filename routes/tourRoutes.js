const fs = require('fs');
const express = require('express');
const controller = require('../controllers/tourControllers');
const router = express.Router();

//shortcut example, top 5 cheapest tour
router.route('/top5-cheap-tour').get(controller.aliasTopTours, controller.getAllTours);
router.route("/stats").get(controller.getTouStatistics)
router.route("/monthly-plan/:year").get(controller.getMonthlyPlan)
router.route('/').get(controller.getAllTours).post(controller.createTour);
router
  .route('/:id')
  .get(controller.getTour)
  .patch(controller.updateTour)
  .delete(controller.deleteTour);


module.exports = router;
