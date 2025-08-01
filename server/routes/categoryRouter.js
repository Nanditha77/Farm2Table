const router = require('express').Router();
const categoryCtrl = require('../controllers/categoryCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin') // kynki hame admin ke saabse category wise rakna hai

router.route('/category') // saare request ko ek saath banalenge
.get(categoryCtrl.getCategories)
.post(auth,authAdmin,categoryCtrl.createCategory);

router.route('/category/:id')  //ab particular category ke liye dynamic route bana lete hai 
.delete(auth,authAdmin,categoryCtrl.deleteCategory) // admin hi delete kar saktha hai
.put(auth,authAdmin,categoryCtrl.updateCategory)

module.exports = router