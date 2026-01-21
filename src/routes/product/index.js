'use strict';

const express = require('express');
const productController = require('../../controllers/product.controller');
const { authentication, authenticationV2 } = require('../../auth/authUtils');
const asyncHander = require('../../helpers/asyncHandler');
const router = express.Router();

router.get('/search/:keySearch', asyncHander(productController.getListSearchProduct));
router.get('', asyncHander(productController.finAllProducts));
router.get('/:product_id', asyncHander(productController.findProduct));

// authenticate
router.use(authenticationV2);
////////////////
router.post('', asyncHander(productController.createProduct));
router.patch('/:productId', asyncHander(productController.updateProduct));
router.post('/publish/:id', asyncHander(productController.publishProductByShop));
router.post('/unpublish/:id', asyncHander(productController.unPublishProductByShop));

// QUERY //
router.get('/draft/all', asyncHander(productController.getAllDraftsForShop));
router.get('/published/all', asyncHander(productController.getAllPublishForShop));

module.exports = router;
