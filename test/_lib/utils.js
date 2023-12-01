let {ansiEscapeRx, specialCharsRx} = require('./vars');

module.exports = {
  getPromptRx(inputPromptRxStr, input = '') {
    if(input) {
      input = input.replace(specialCharsRx, '\\$&').replace(/\s+/g, '\\s+');
    }

    return new RegExp(inputPromptRxStr + input, 'gi');
  },

  removeEscapeChars(data) {
    return data.toString().replace(ansiEscapeRx, '');
  },

  transformInput(input) {
    if(Array.isArray(input)) {
      input = input.join('');
    }

    return input;
  }
};
