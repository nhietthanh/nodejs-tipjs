"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokensPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  ConflicRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITE: "WRITE",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  /*
  check is token used?
   */
  static handlerRefreshToken = async(refreshToken)=>{
    //check xem token nay da duoc su dung chua? 
    const foundToken = await KeyTokenService.finByRefreshTokenUsed(refreshToken)
    if(foundToken){
      // decode xem may la thang nao?
      const {userId, email} = await verifyJWT(refreshToken,foundToken.privateKey)
      console.log({userId, email})
      // xoa tat ca token trong keyStore
      await KeyTokenService.deleteKeyById(userId)
      throw new ForbiddenError('Something wrong happend!! pls relogin')
    }
    // No, qua ngon
    const holderToken = await KeyTokenService.finByRefreshToken(refreshToken)
    if(!holderToken) throw new AuthFailureError('Shop not registeted!')
    
      // verifyToken
      const {userId, email} = await verifyJWT(refreshToken, holderToken.privateKey)
      console.log(`[2]---`,{userId,email})
      // check Userid
      const foundShop = await findByEmail({email})
      if(!foundShop) throw new AuthFailureError('Shop not registeted!')
        // create 1 cap moi

      const tokens = await createTokensPair({userId,email}, holderToken.privateKey, holderToken.publicKey)
      // update token
      await  holderToken.updateOne({
        $set:{
          refreshToken:tokens.refreshToken
        },
        $addToSet:{
          refreshTokensUsed:refreshToken //da duoc su dung de lay token moi roi  
        }
      })
      return{
        user:{userId,email},
        tokens
      }
  }

  /*
    1 - check email in dbs
    2- match password
    3- create AI RT and save
    4- genarate tokens
    5- get data return login
  */

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return delKey;
  };

  static login = async ({ email, password, refreshToken = null }) => {
    // 1
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop not registerted!");
    // 2
    const match = await bcrypt.compare(password, foundShop.password);

    if (!match) throw new AuthFailureError("Auuthentication error");

    // 3
    // create privateKey, publicKey
    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    });

    // 4 generate tokens
    const { _id: userId } = foundShop;
    const tokens = await createTokensPair(
      { userId, email },
      privateKey,
      publicKey
    );

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId,
    });
    return {
      shop: getInfoData({
        fileds: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
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

      const publicKeyString = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!publicKeyString) {
        throw new BadRequestError("Error: Shop already registed!");
      }

      // created token pair

      const tokens = await createTokensPair(
        { userId: newShop._id, email },
        privateKey,
        publicKey
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
