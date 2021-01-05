const express = require('express');
const coursesControllers = require('../controllers/courses');
const advancedResults = require('../middlewares/advanced.results');
const Course = require('../models/Course');
const router = express.Router({mergeParams: true});

router
    .route('/')
    .get(
        advancedResults(Course, {
            path: 'bootcamp',
            select: 'name description',
        }),
        coursesControllers.getCourses,
    )
    .post(coursesControllers.createCourse);

router
    .route('/:id')
    .get(coursesControllers.getSingleCourse)
    .put(coursesControllers.updateCourse)
    .delete(coursesControllers.deleteCourse);

module.exports = router;
