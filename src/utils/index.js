'use strict';

const pick = require('lodash/pick');
const { Types } = require('mongoose');

const convertObjectIdMongodb = (id) => Types.ObjectId(id);

const getInfoData = ({ fileds = [], object = {} }) => {
  return pick(object, fileds);
};

//['a','b'] = {a:1, b:1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};
//['a','b'] = {a:0, b:0}
const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefineObject = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] === null || obj[k] === undefined) {
      delete obj[k];
    }
  });
  return obj;
};

const updateNestedObjectParser = (object) => {
  console.log('[1::]', object);
  const final = {};
  Object.keys(object).forEach((k) => {
    if (typeof object[k] === 'object' && !Array.isArray(object[k])) {
      const response = updateNestedObjectParser(object[k]);
      Object.keys(response).forEach((a) => {
        final[`${k}.${a}`] = response[a];
      });
    } else {
      final[k] = object[k];
    }
  });
  console.log('[2::]', final);
  return final;
};

module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefineObject,
  updateNestedObjectParser,
  convertObjectIdMongodb,
};
