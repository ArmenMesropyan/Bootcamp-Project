const express = require('express');
const dotenv = require('dotenv');
const bootcampRoutes = require('./routes/bootcamps');
const morgan = require('morgan');

// Load env variables
dotenv.config({path: './config/config.env'});

const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routers
app.use('/api/v1/bootcamps', bootcampRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
    console.log(
        `App listening in ${process.env.NODE_ENV} mode on port ${PORT}!`,
    ),
);
