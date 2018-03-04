#!/usr/bin/env node

/* eslint no-console: 0 */
const argv = require("yargs").argv;
const fs = require("fs");
const path = require("path");
const SolidityXParser = require("./index.js");
//const SolidityXCompiler = require("./compiler.js");
const SolidityToGo = require("./transpiler/transpiler.js");


try {
    let result;
    let outputFile = "";
    let originalSrc = "";
    let outputGoFile = "";
    if (argv.e) {
        result = SolidityXParser.parse(argv.e || argv.expression);
        originalSrc = argv.e || argv.expression
    } else {
        let filePath = argv.f || argv.file || argv._[0];
        originalSrc = fs.readFileSync(path.resolve(filePath), {encoding: "utf8"});
        result = SolidityXParser.parse(originalSrc);
        outputFile = argv._[1]  + ".sol"|| argv.outputfile + ".sol";
        outputGoFile  = argv._[1] + ".go" || argv.outputfile + ".go";
    }
    //SolidityXCompiler.compileToSolidityToFile(originalSrc, result, outputFile);
    SolidityToGo.compileToGoToFile(result, outputGoFile);

} catch (e) {
    console.error(e.message);
    process.exit(1);
}
