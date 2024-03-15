const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

exports.topTours = (req, res, next) => {
    req.query.limit = 5;
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

    next();
};

exports.getAllTours = async (req, res) => {
    try {
        const apiFeatures = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const tours = await apiFeatures.query;

        res.status(200).json({
            status: 'Success',
            result: tours.length,
            data: {
                tours,
            },
        });
    } catch (error) {
        res.status(404).json({
            status: 'Fail',
            message: error.message,
        });
    }
};

exports.getATourById = async (req, res) => {
    const id = req.params.id;

    try {
        const tour = await Tour.findById(id);

        res.status(200).json({
            status: 'Success',
            data: {
                tour,
            },
        });
    } catch (error) {
        res.status(404).json({
            status: 'Fail',
            message: error.message,
        });
    }
};

exports.createATour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'Success',
            data: {
                tour: newTour,
            },
        });
    } catch (error) {
        res.status(404).json({
            status: 'Fail',
            message: error.message,
        });
    }
};

exports.updateATour = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedTour = await Tour.findByIdAndUpdate(id, req.body);

        res.status(200).json({
            status: 'Success',
            data: {
                tour: updatedTour,
            },
        });
    } catch (error) {
        res.status(404).json({
            status: 'Fail',
            message: error.message,
        });
    }
};

exports.deleteATour = async (req, res) => {
    try {
        const id = req.params.id;

        const deletedTour = await Tour.findByIdAndDelete(id);

        res.status(204).json({
            status: 'Success',
            message: 'Tour has been deleted',
        });
    } catch (error) {
        res.status(404).json({
            status: 'Fail',
            message: error.message,
        });
    }
};

exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } },
            },
            {
                $group: {
                    _id: { $toUpper: '$difficulty' },
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                },
            },
            {
                $sort: { avgPrice: 1 },
            },
        ]);

        res.status(200).json({
            status: 'Success',
            data: {
                stats,
            },
        });
    } catch (error) {
        res.status(404).json({
            status: 'Fail',
            message: error,
        });
    }
};
