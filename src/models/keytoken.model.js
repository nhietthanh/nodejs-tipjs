"use strict";

const { Schema, model, default: mongoose } = require("mongoose");

const DOCUMENT_NAME = "Key";
const COLLECTION_NAME = "Keys";

const keyTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "Shop",
    },
    publicKey: {
      type: String,
      require: true,
    },
    privateKey: {
      type: String,
      require: true,
    },
    refreshTokensUsed: {
      type: Array,
      default: [], //nhung refresh token da duoc su dung
    },
    refreshToken: {
      type: String,
      require: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, keyTokenSchema);
