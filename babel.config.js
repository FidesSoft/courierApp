/*
 * @Author: @vedatbozkurt
 * @Email: info@wedat.org
 * @Date: 2021-03-21 12:41:16
 * @LastEditors: @vedatbozkurt
 * @LastEditTime: 2021-03-21 12:41:16
 */
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ["@babel/plugin-proposal-decorators", { "legacy": true}],
],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};