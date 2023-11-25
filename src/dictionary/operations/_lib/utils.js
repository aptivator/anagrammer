let path              = require('path');
let {dictionariesDir} = require('../../../_lib/vars');

module.exports = {
  getDictionariesPath(subpath = '') {
    return path.resolve(__dirname, '../../../..', dictionariesDir, subpath);
  }
};
