const tourController = require('../controllers/tourController');
const express = require('express');
const router = express.Router();

router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.createATour);

router
    .route('/:id')
    .get(tourController.getATourById)
    .patch(tourController.updateATour)
    .delete(tourController.deleteATour);

module.exports = router;