const express = require('express');
const authControllers = require('../controllers/auth');
const {authMiddleware} = require('../middlewares/auth');
const router = express.Router();

router.route('/register').post(authControllers.registerUser);
router.route('/login').post(authControllers.loginUser);
router.route('/me').get(authMiddleware, authControllers.getMe);
router.route('/forgot').post(authControllers.sendForgotEmail);
router.route('/forgot/update/:resetToken').put(authControllers.updatePassword);

module.exports = router;
