#!/usr/bin/env node

let {startAnagrammer}                 = require('./anagrammer/anagrammer');
let {respondToOptionsOrGetDictionary} = require('./dictionary/dictionary');
let {startAndGetOptions}              = require('./initializer/initializer');

let options = startAndGetOptions();
let dictionaryConfigs = respondToOptionsOrGetDictionary(options);
startAnagrammer(dictionaryConfigs);
