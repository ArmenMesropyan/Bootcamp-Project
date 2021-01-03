const express = require('express');
const dotenv = require('dotenv');
const bootcampRoutes = require('./routes/bootcamps');
const morgan = require('morgan');
const connectDb = require('./config/db');
const errorHandler = require('./middlewares/error.handler');

require('colors');

// Load env variables
dotenv.config({path: './config/config.env'});

// Connect to database
connectDb();

const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Body Parser
app.use(express.json());

// Routers
app.use('/api/v1/bootcamps', bootcampRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
    console.log(
        `App listening in ${process.env.NODE_ENV} mode on port ${PORT}!`.cyan
            .bold,
    ),
);

process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`.bold.red);

    server.close(() => process.exit(1));
});
