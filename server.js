const express = require('express');
const dotenv = require('dotenv');
const bootcampRoutes = require('./routes/bootcamps');
const morgan = require('morgan');
const connectDb = require('./config/db');

// Load env variables
dotenv.config({path: './config/config.env'});

// Connect to database
connectDb();

const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routers
app.use('/api/v1/bootcamps', bootcampRoutes);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
    console.log(
        `App listening in ${process.env.NODE_ENV} mode on port ${PORT}!`,
    ),
);

process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`);

    server.close(() => process.exit(1));
});
