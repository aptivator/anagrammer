let {Command}            = require('commander');
let {softwareNamePretty} = require('../_lib/vars');

module.exports = {
  startAndGetOptions() {
    console.log(softwareNamePretty);
    console.log();

    return new Command()
      .version('0.0.1')
      .description('A CLI tool for querying anagrams')
      .option('-f, --file  [file path]', 'path to a dictionary file')
      .option('-l, --list', 'listing of all the available dictionaries')
      .option('-n, --name <dictionary name>', 'name of an existing dictionary or a name under which to save an imported dictionary')
      .option('-o, --override', 'indicator to override an existing dictionary')
      .option('-r, --remove <dictionary name>', 'name of a dictionary to delete')
      .parse(process.argv)
      .opts();
  }
};
