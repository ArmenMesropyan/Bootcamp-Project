const express = require('express');
const bootcampsControllers = require('../controllers/bootcamps');
const router = express.Router();

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
