const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);
router
    .route('/updatePassword')
    .patch(authController.protect, authController.updatePassword);

router.route('/').get(userController.getAllUsers);
router.route('/updateMe').patch(authController.protect, userController.updateMe);
router.route('/deleteMe').patch(authController.protect, userController.deleteMe);

module.exports = router;
