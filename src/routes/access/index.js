"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { authentication } = require("../../auth/authUtils");
const asyncHander = require("../../helpers/asyncHandler");
const router = express.Router();

// signUp
router.post("/shop/signup", asyncHander(accessController.signUp));
router.post("/shop/login", asyncHander(accessController.login));

// authenticate
router.use(authentication);
////////////////

router.post("/shop/logout", asyncHander(accessController.logout));
router.post("/shop/refreshToken", asyncHander(accessController.handlerRefreshToken));

module.exports = router;
