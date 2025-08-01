const userCtrl = require('../controllers/userCtrl');
const auth = require('../middleware/auth');

const router = require('express').Router();

router.post('/register', userCtrl.register)
router.post('/login', userCtrl.login)
router.get('/logout', userCtrl.logout)
router.get('/refresh_token', userCtrl.refreshtoken)
router.get('/infor', auth,userCtrl.getUser)  //user route banathe hai,user info chahiye so(getUser func made in userCtrl.js) authrozation ke saath user info chahiye so

module.exports = router;