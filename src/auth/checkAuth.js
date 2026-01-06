"use strict";

const { findById } = require("../services/apikey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }

    // check objKey

    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }

    req.objKey = objKey;

    return next();
  } catch (error) {}
};

const permisstion = (permisstion) => {
  return (req, res, next) => {
    console.log(req);
    if (!req.objKey.permisstions) {
      return res.status(403).json({
        message: "permisstion denied",
      });
    }

    const validPermisstion = req.objKey.permisstions.includes(permisstion);
    if (!validPermisstion) {
      return res.status(403).json({
        message: "permisstion denied",
      });
    }

    return next();
  };
};

const asyncHander = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = {
  apiKey,
  permisstion,
  asyncHander,
};
