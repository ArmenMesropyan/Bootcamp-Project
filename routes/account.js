const express = require('express');
const accountControllers = require('../controllers/account');
const {authMiddleware} = require('../middlewares/auth');
const router = express.Router();

router.route('/details').put(authMiddleware, accountControllers.updateDetails);
router
    .route('/password')
    .put(authMiddleware, accountControllers.updatePassword);

module.exports = router;
