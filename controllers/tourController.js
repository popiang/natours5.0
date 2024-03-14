const Tour = require('../models/tourModel');

exports.topTours = (req, res, next) => {
    req.query.limit = 5;
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

    next();
};

exports.getAllTours = async (req, res) => {
    try {
		// filter
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'limit', 'sort', 'fields'];
        excludedFields.forEach((field) => delete queryObj[field]);

		// advance filter
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gt|gte|lt|lte)\b/g,
            (match) => `$${match}`
        );

        let query = Tour.find(JSON.parse(queryStr));

		// sort
		if (req.query.sort) {
			const sortBy = req.query.sort.split(",").join(" ");
			query = query.sort(sortBy);
		} else {
			query = query.sort('-createdBy');
		}

		// limit fields
		if (req.query.fields) {
			const limitFields = req.query.fields.split(",").join(" ");
			query = query.select(limitFields);
		} else {
			query = query.select("-__v");
		}

		// pagination
		const page = req.query.page * 1 || 1;
		const limit = req.query.limit * 1 || 100;
		const skip = (page - 1) * limit;
		query = query.skip(skip).limit(limit);

        const tours = await query;

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


