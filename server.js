const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

// Load env variables
const dotenv = require('dotenv');

dotenv.config({path: './config/config.env'});

const bootcampRoutes = require('./routes/bootcamps');
const coursesRoutes = require('./routes/courses');
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/account');
const userRoutes = require('./routes/user');

const connectDb = require('./config/db');
const errorHandler = require('./middlewares/error.handler');

require('colors');

// Connect to database
connectDb();

const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Body Parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// File Upload
app.use(fileUpload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routers
app.use('/api/v1/bootcamps', bootcampRoutes);
app.use('/api/v1/courses', coursesRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/account', accountRoutes);
app.use('/api/v1/users', userRoutes);

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
