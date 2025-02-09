const express = require("express");
const { login,signup ,logout,franchisesList} = require("../controllers/franchise.auth.controlles");
const router = express.Router();

router.post("/login", login);
router.get("/logout", logout);
router.post("/signup", signup);
router.get("/list", franchisesList);

module.exports = router;