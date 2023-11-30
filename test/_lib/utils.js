let {ansiEscapeRx, specialCharsRx} = require('./vars');

module.exports = {
  getPromptRx(promptStr) {
    promptStr = promptStr.replace(specialCharsRx, "\\$&").replace(/\s+/g, '\\s+');
    return new RegExp(promptStr, 'gi');
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
