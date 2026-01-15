'use strict';

const { CREATE, SuccessReponse } = require('../core/success.response');
const AccessService = require('../services/access.service');

class AcessController {
  handlerRefreshToken = async (req, res, next) => {
    // new SuccessReponse({
    //   message: "Get token success!",
    //   metadata: await AccessService.handlerRefreshToken(req.body.refreshToken),
    // }).send(res);
    // V2 fixed

    console.log('req.user', req.user);
    new SuccessReponse({
      message: 'Get token success!',
      metadata: await AccessService.handlerRefreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };
  logout = async (req, res, next) => {
    new SuccessReponse({
      message: 'Logout Success',
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };
  login = async (req, res, next) => {
    new SuccessReponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };
  signUp = async (req, res, next) => {
    new CREATE({
      message: 'Registered OK!',
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };
}

module.exports = new AcessController();
