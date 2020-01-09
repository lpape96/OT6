const router = require('express').Router();
const am = require('../utils/async-middleware');

const userController = require('../controllers/userController');

router.get('/userRes', am(userController.getAllUserRes));
router.post('/userLogs', am(userController.addUserInfo));

module.exports = router;
