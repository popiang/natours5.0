const AppError = require('../utils/appError');

const handleCaseErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 404);
};

const handleDuplicateFieldsDB = (err) => {
    const value = Object.values(err.keyValue[0]);
    const message = `Duplicate field: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
	const errors = Object.values(err.errors).map(el => el.message);
	const message = `Invalid input data: ${errors.join(', ')}`;
	return new AppError(message, 400);
}
 
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendProdDev = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        console.log('Error!', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!',
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.name = err.name;

        if (error.name === 'CastError') {
            error = handleCaseErrorDB(error);
        }

        if (error.code === 11000) {
			error = handleDuplicateFieldsDB(error);
        }

		if (error.name === 'ValidationError') {
			error = handleValidationErrorDB(error);
		}

        sendProdDev(error, res);
    }
};
