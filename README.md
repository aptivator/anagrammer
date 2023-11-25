# anagrammer

### Introduction

Anagram of a word is another word with the same letters in a different order.  This
software provides a command line interface to manage dictionaries and to query them
for anagrams.

### Installation

`anagrammer` is written in JavaScript and requires Node.js and NPM to run.  The best way
to install the latter is to use [NVM](https://github.com/nvm-sh/nvm#installing-and-updating).

After Node.js and NPM are installed, run `npm install` inside the directory where this
README.md is found.

On Unix-like systems, the software can be made available globally by running `npm link`.
If the operation is successful, `anagrammer` command can be invoked from the console.
Otherwise, the utility would have to be called directly from the source folder.

### Usage

#### Default Usage

The software comes with included default dictionary and can be run without any options,
e.g., `anagrammer` (if `npm link`ing is successful) or `node ./src/index.js`.

Running `npm start` command from `anagrammer` directory is also available.  For this
arrangement, configuration options (whenever they are needed) should be preceded with
the `--` flag, e.g., `npm start -- --list`.

#### Examples

To load a dictionary file and save it under an alias, run the following:

```
anagrammer --file ./dictionary.txt --name full
```

To load a dictionary file temporarily, invoke `anagrammer` like so:

```
anagrammer -f ./dictionary.txt
```

To activate an existing dictionary, simply pass its name to the software.

```
anagrammer -n full
```

#### Configuration Options

Running `anagrammer -h` will describe all of the features that the software currently
supports.

### Other Notes

Relative dictionary file paths are "calculated" based on a directory from which `anagrammer`
is called.

Dictionary names should not have spaces.

Dictionary and queried words are treated case insensitively.
