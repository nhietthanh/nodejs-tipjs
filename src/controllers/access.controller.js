"use strict";

const { CREATE } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AcessController {
  signUp = async (req, res, next) => {
    new CREATE({
      message: "Registered OK!",
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };
}

module.exports = new AcessController();
