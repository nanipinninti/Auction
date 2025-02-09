const express = require("express");
const { login,signup ,logout} = require("../controllers/admin.auth.controllers");
const router = express.Router();

router.post("/login", login);
router.get("/logout", logout);
router.post("/signup", signup);

module.exports = router;