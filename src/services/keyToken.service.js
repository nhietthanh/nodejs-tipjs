"use strict";

const keytokenModel = require("../models/keytoken.model");

const { Types } = require("mongoose");
class KeyTokenService {
  static createKeyToken = async ({
    userId,
    refreshToken,
    privateKey,
    publicKey,
  }) => {
    try {
      // level 0
      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });
      // return tokens ? tokens.publicKey : null;

      // level xxx
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokensUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };

      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      throw error;
    }
  };

  static findByUserId = async (userId) => {
    return await keytokenModel
      .findOne({ user: new Types.ObjectId(userId) })
      .lean();
  };

  static removeKeyById = async (id) => {
    return await keytokenModel.deleteOne(id);
  };

  static finByRefreshTokenUsed = async (refreshToken)=>{
    return await keytokenModel.findOne({refreshTokensUsed:refreshToken}).lean()
  }
  static finByRefreshToken = async (refreshToken)=>{
    return await keytokenModel.findOne({refreshToken})
  }
  static deleteKeyById = async (userId)=>{
    return await keytokenModel.deleteOne({user:new Types.ObjectId(userId)})
  }
}

module.exports = KeyTokenService;
