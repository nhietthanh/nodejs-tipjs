"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokensPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  ConflicRequestError,
} = require("../core/error.response");
const { finByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITE: "WRITE",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await finByEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop not registerted!");

    const match = bcrypt.compare(password, foundShop.password);
  };

  static signUp = async ({ name, email, password }) => {
    // step1: check email exists??
    const hodelShop = await shopModel.findOne({ email }).lean();
    if (hodelShop) {
      throw new BadRequestError("Error: Shop already registed!");
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });
    if (newShop) {
      // created privateKey, publicKey
      // const privateKey = crypto.randomBytes(64).toString('hex')
      // const publicKey = crypto.randomBytes(64).toString('hex')

      const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs1",
          format: "pem",
        },
      });

      console.log({ privateKey, publicKey }); //save collection keyStore

      const publicKeyString = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
      });

      if (!publicKeyString) {
        throw new BadRequestError("Error: Shop already registed!");
      }

      const publicKeyObject = crypto.createPublicKey(publicKeyString);

      console.log("publicKeyObject::", publicKeyObject);

      // created token pair

      const tokens = await createTokensPair(
        { userId: newShop._id, email },
        publicKeyString,
        privateKey
      );

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fileds: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AccessService;
