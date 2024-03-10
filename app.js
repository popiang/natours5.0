const express = require('express');
const morgan = require('morgan');
const borderParser = require('body-parser');

const tourRouter = require('./routes/tourRoutes');

const app = express();

app.use(borderParser.json());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours', tourRouter);

module.exports = app;
