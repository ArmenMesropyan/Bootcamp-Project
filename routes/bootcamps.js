const express = require('express');
const bootcampsControllers = require('../controllers/bootcamps');
const router = express.Router();

// Include another routes
const courseRouter = require('./courses');

// Re-route to another routers
router.use('/courses/:bootcampId', courseRouter);

router
    .route('/radius/:distance')
    .get(bootcampsControllers.getBootcampsInRadius);

router
    .route('/')
    .get(bootcampsControllers.getAllBootcamps)
    .post(bootcampsControllers.createBootcamp);

router
    .route('/:id')
    .get(bootcampsControllers.getSingleBootcamp)
    .put(bootcampsControllers.updateBootcamp)
    .delete(bootcampsControllers.deleteBootcamp);

module.exports = router;
