"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHander } = require("../../auth/checkAuth");
const router = express.Router();

// signUp
router.post("/shop/signup", asyncHander(accessController.signUp));

module.exports = router;
