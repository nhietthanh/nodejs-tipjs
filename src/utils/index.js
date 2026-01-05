"use strict";

const pick = require("lodash/pick");

const getInfoData = ({ fileds = [], object = {} }) => {
  return pick(object, fileds);
};

module.exports = {
  getInfoData,
};
