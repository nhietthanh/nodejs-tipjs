"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const { authentication } = require("../../auth/authUtils");
const asyncHander = require("../../helpers/asyncHandler");
const router = express.Router();

// authenticate
router.use(authentication);
////////////////
router.post("", asyncHander(productController.createProduct));

module.exports = router;
