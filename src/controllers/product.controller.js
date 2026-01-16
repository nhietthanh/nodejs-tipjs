'use strict';

const { SuccessReponse } = require('../core/success.response');

const ProductService = require('../services/product.service');
const ProductServiceV2 = require('../services/product.service.xxx');

class ProductController {
  createProduct = async (req, res, next) => {
    // new SuccessReponse({
    //   message: "Create new Product success!",
    //   metadata: await ProductService.createProduct(req.body.product_type, {
    //     ...req.body,
    //     product_shop: req.user.userId,
    //   }),
    // }).send(res);

    /*  version V2 */
    console.log('tao moi', req.user);
    new SuccessReponse({
      message: 'Create new Product success!',
      metadata: await ProductServiceV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    new SuccessReponse({
      message: 'publishProductByShop success!',
      metadata: await ProductServiceV2.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  unPublishProductByShop = async (req, res, next) => {
    new SuccessReponse({
      message: 'unPublishProductByShop success!',
      metadata: await ProductServiceV2.unPublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  // QUERY //
  /**
   * @description Get all Drafts for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  getAllDraftsForShop = async (req, res, next) => {
    console.log('req', req.user);
    new SuccessReponse({
      message: 'Get List Draft success!',
      metadata: await ProductServiceV2.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublishForShop = async (req, res, next) => {
    new SuccessReponse({
      message: 'Get List Publish success!',
      metadata: await ProductServiceV2.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getListSearchProduct = async (req, res, next) => {
    new SuccessReponse({
      message: 'Get List getListSearchProduct success!',
      metadata: await ProductServiceV2.searchProducts(req.params),
    }).send(res);
  };

  //END QUERY //
}

module.exports = new ProductController();
