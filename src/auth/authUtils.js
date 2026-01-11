"use strict";

const JWT = require("jsonwebtoken");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");
const asyncHander = require("../helpers/asyncHandler");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const createTokensPair = async (payload, privateKey, publicKey) => {
  try {
    // accessToken
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2d",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7d",
    });

    //
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log(`error verify::`, err);
      } else {
        console.log(`decode verify::`, decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};

const authentication = asyncHander(async (req, res, next) => {
  /*
  1 - check userId missing??
  2 - get accessToken
  3 - verifyToken
  4 - check user trong dbs?
  5 - check keyStore with this userId?
  6 - Ok all => return next() 
  */

  const userId = req.headers[HEADER.CLIENT_ID];

  if (!userId) throw new AuthFailureError("Invalid Request!");
  // 2
  const keyStore = await findByUserId(userId);
  console.log("keyStore", keyStore);

  if (!keyStore) throw new NotFoundError("NotFound keyStore");
  // 3
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new NotFoundError("Invalid Request");

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) {
      throw new AuthFailureError("Invalid Userid");
    }
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, keySecret)=>{
  return await JWT.verify(token, keySecret)
}

module.exports = {
  createTokensPair,
  authentication,
  verifyJWT
};
