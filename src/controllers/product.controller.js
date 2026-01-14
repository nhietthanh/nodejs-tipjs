"use strict";

const { SuccessReponse } = require("../core/success.response");

const ProductService = require("../services/product.service");

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessReponse({
      message: "Create new Product uccess!",
      metadata: await ProductService.createProduct(
        req.body.product_type,
        req.body
      ),
    }).send(res);
  };
}

module.exports = new ProductController();
