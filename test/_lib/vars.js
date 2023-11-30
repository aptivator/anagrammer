module.exports = {
  ansiEscapeRx: new RegExp('[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)|(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))', 'g'),
  operationsTimeBuffer: 5,
  specialCharsRx: /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g
};
