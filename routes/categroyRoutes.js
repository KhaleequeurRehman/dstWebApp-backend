const express = require("express");
const {
    createCategory,
    getAllCaterories,
    getSingleCategory,
    deleteCategory,
    updateCategory
} = require('../controllers/categoryController');

const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

router.route("/category").get(getAllCaterories).post(createCategory)
// .get(isAuthenticatedUser, authorizeRoles('admin'), getAllCaterories)
// .post(isAuthenticatedUser, createCategory)

router.route("/category/:id")
.get(getSingleCategory)
.put(updateCategory)
.delete(deleteCategory);
// router.route("/category/:id").put(isAuthenticatedUser, authorizeRoles('admin'), updateCategory).delete(isAuthenticatedUser, authorizeRoles('admin'), deleteCategory);

module.exports = router;