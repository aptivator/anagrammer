let concat                                           = require('concat-stream');
let spawn                                            = require('cross-spawn');
let fs                                               = require('fs');
let {constants}                                      = require('os');
let {getPromptRx, removeEscapeChars, transformInput} = require('./utils');
let {operationsTimeBuffer}                           = require('./vars');

function spawnChild(scriptPath, args, env) {
  if(fs.existsSync(scriptPath)) {
    let {PATH} = process.env;
    args.unshift(scriptPath);

    return spawn('node', args, {
      env: {NODE_ENV: 'test', PATH, ...env},
      stdio: [null, null, null, 'ipc']
    });
  }

  throw new Error(`invalid script path: ${scriptPath}`);
}

function cli({scriptPath, args = [], inputs = [], env = {}, inputPrompt = ''}) {
  return new Promise((resolve, reject) => {
    let child = spawnChild(scriptPath, args, env);

    function handleError(err) {
      child.stdin.end();
      child.kill(constants.signals.SIGTERM);
      reject(err.toString());
    }

    child.stdin.setEncoding('utf-8');
    child.stderr.once('data', handleError);
    child.once('error', handleError);
    child.stdout.pipe(concat((output) => resolve(output.toString())));

    if(inputs.length) {
      let promptRx = getPromptRx(inputPrompt);

      function writeInputs(index = 0) {
        let input = transformInput(inputs[index]);
        let promptStr = inputPrompt + ' ' + input;
        let promptRx = getPromptRx(promptStr);
  
        function initiateNextInput(data) {
          data = removeEscapeChars(data);

          if(promptRx.test(data)) {
            child.stdout.off('data', initiateNextInput);
  
            if(++index < inputs.length) {
              return setTimeout(() => writeInputs(index), operationsTimeBuffer);
            }
  
            child.stdin.end();
          }
        }
  
        child.stdout.on('data', initiateNextInput);
        child.stdin.write(input);
      }

      function initiateInputWriting(data) {
        data = removeEscapeChars(data);

        if(promptRx.test(data)) {
          child.stdout.off('data', initiateInputWriting);
          setTimeout(() => writeInputs(), operationsTimeBuffer);
        }
      }

      return child.stdout.on('data', initiateInputWriting);
    }
    
    setTimeout(() => child.stdin.end(), operationsTimeBuffer);
  });
}

module.exports = {
  cli,
  ENTER: '\x0D'
};
