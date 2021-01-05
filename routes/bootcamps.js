const express = require('express');
const bootcampsControllers = require('../controllers/bootcamps');
const router = express.Router();
const Bootcamp = require('../models/Bootcamp');

const advancedResults = require('../middlewares/advanced.results');

// Include another routes
const courseRouter = require('./courses');
const {authMiddleware, roleMiddleware} = require('../middlewares/auth');

// Re-route to another routers
router.use('/courses/:bootcampId', courseRouter);

router
    .route('/radius/:distance')
    .get(bootcampsControllers.getBootcampsInRadius);

router
    .route('/')
    .get(
        advancedResults(Bootcamp, 'courses'),
        bootcampsControllers.getAllBootcamps,
    )
    .post(
        authMiddleware,
        roleMiddleware('publisher', 'admin'),
        bootcampsControllers.createBootcamp,
    );

router
    .route('/:id')
    .get(bootcampsControllers.getSingleBootcamp)
    .put(
        authMiddleware,
        roleMiddleware('publisher', 'admin'),
        bootcampsControllers.updateBootcamp,
    )
    .delete(
        authMiddleware,
        roleMiddleware('publisher', 'admin'),
        bootcampsControllers.deleteBootcamp,
    );

router
    .route('/:id/photo')
    .put(
        authMiddleware,
        roleMiddleware('publisher', 'admin'),
        bootcampsControllers.bootcampPhotoUpload,
    );

module.exports = router;
