"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHander } = require("../../auth/checkAuth");
const router = express.Router();

// signUp
router.post("/shop/signup", asyncHander(accessController.signUp));
router.post("/shop/login", asyncHander(accessController.login));

module.exports = router;
