//const path = require('path');
const express = require('express');
const { body } = require('express-validator');
const playerController = require('../controllers/player');
const isAuth = require('../middleware/is-auth');
const router = express.Router();
router.get('/editUserProfile', playerController.getProfile);
router.get('/dashboard', playerController.getDashboard);
router.use('/playGame', playerController.getPlayGame);
router.post('/postGamePlay', playerController.postGamePlay);
router.post('/postPlayerMove', playerController.postPlayerMove)
module.exports = router;