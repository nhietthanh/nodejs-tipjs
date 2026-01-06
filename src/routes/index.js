"use strict";

const express = require("express");
const { apiKey, permisstion } = require("../auth/checkAuth");
const router = express.Router();

// check apikey
router.use(apiKey);
// check permisstion
router.use(permisstion("0000"));

router.use("/v1/api", require("./access"));

module.exports = router;
