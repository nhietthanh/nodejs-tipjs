"use strict";

const { CREATE, SuccessReponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AcessController {
  login = async (req, res, next) => {
    new SuccessReponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };
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
