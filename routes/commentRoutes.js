const express = require("express");
const {
    addOne,
    removeOne,
    getAll
} = require('../controllers/commentController');

const router = express.Router();
// const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

router.route("/comment").post(addOne)
router.route("/comment").get(getAll)
router.route("/comment").delete(removeOne)

module.exports = router;