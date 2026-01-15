'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const { authentication, authenticationV2 } = require('../../auth/authUtils');
const asyncHander = require('../../helpers/asyncHandler');
const router = express.Router();

// signUp
router.post('/shop/signup', asyncHander(accessController.signUp));
router.post('/shop/login', asyncHander(accessController.login));

// authenticate
router.use(authenticationV2);
////////////////

router.post('/shop/logout', asyncHander(accessController.logout));
router.post('/shop/refreshToken', asyncHander(accessController.handlerRefreshToken));

module.exports = router;
