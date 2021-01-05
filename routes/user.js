const express = require('express');
const userController = require('../controllers/user');
const advancedResults = require('../middlewares/advanced.results');
const router = express.Router({mergeParams: true});

const {authMiddleware, roleMiddleware} = require('../middlewares/auth');
const User = require('../models/User');

router.use(authMiddleware);
router.use(roleMiddleware('admin'));

router
    .route('/')
    .get(advancedResults(User, 'bootcamps'), userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/:userId')
    .get(userController.getSingleUser)
    .put(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
