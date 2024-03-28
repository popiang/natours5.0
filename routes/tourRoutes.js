const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router();

router
    .route('/top-5-cheap')
    .get(tourController.topTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/tour-plan/:year').get(tourController.getMonthlyPlan);

router
    .route('/')
    .get(authController.protect, tourController.getAllTours)
    .post(tourController.createATour);

router
    .route('/:id')
    .get(tourController.getATourById)
    .patch(tourController.updateATour)
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'guide-lead'),
        tourController.deleteATour
    );

module.exports = router;
