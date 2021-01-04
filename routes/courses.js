const express = require('express');
const coursesControllers = require('../controllers/courses');
const router = express.Router({mergeParams: true});

router
    .route('/')
    .get(coursesControllers.getCourses)
    .post(coursesControllers.createCourse);

router
    .route('/:id')
    .get(coursesControllers.getSingleCourse)
    .put(coursesControllers.updateCourse)
    .delete(coursesControllers.deleteCourse);

module.exports = router;
