const express = require("express");
const { login,signup ,logout} = require("../controllers/franchise.auth.controlles");
const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/signup", signup);

module.exports = router;