const express = require('express');
const coursesControllers = require('../controllers/courses');
const advancedResults = require('../middlewares/advanced.results');
const Course = require('../models/Course');
const router = express.Router({mergeParams: true});

const {authMiddleware, roleMiddleware} = require('../middlewares/auth');

router
    .route('/')
    .get(
        advancedResults(Course, {
            path: 'bootcamp',
            select: 'name description',
        }),
        coursesControllers.getCourses,
    )
    .post(
        authMiddleware,
        roleMiddleware('publisher', 'admin'),
        coursesControllers.createCourse,
    );

router
    .route('/:id')
    .get(coursesControllers.getSingleCourse)
    .put(
        authMiddleware,
        roleMiddleware('publisher', 'admin'),
        coursesControllers.updateCourse,
    )
    .delete(
        authMiddleware,
        roleMiddleware('publisher', 'admin'),
        coursesControllers.deleteCourse,
    );

module.exports = router;
