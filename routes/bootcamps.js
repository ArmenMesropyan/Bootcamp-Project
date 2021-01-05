const express = require('express');
const bootcampsControllers = require('../controllers/bootcamps');
const router = express.Router();
const Bootcamp = require('../models/Bootcamp');

const advancedResults = require('../middlewares/advanced.results');

// Include another routes
const courseRouter = require('./courses');

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
    .post(bootcampsControllers.createBootcamp);

router
    .route('/:id')
    .get(bootcampsControllers.getSingleBootcamp)
    .put(bootcampsControllers.updateBootcamp)
    .delete(bootcampsControllers.deleteBootcamp);

router.route('/:id/photo').put(bootcampsControllers.bootcampPhotoUpload);

module.exports = router;
