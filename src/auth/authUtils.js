"use strict";

const JWT = require("jsonwebtoken");
const createTokensPair = async (payload, publicKey, privateKey) => {
  try {
    // accessToken
    const accessToken = await JWT.sign(payload, publicKey, {
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
    console.log("refreshToken", refreshToken);
    return { accessToken, refreshToken };
  } catch (error) {}
};

module.exports = {
  createTokensPair,
};
