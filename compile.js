'use strict';
const path = require("path");
const fs = require("fs");
const solc = require("solc");

const pathTestSols = path.resolve(__dirname, "test/test-sols");
const files = fs.readdirSync(pathTestSols);
const targetFiles = files.filter(function(file) {
    return path.extname(file).toLowerCase() === ".sol";
});

let input = {};
for ( let file of targetFiles) {
    let filePath = path.resolve(pathTestSols, file);
    input[file] = fs.readFileSync(filePath, "utf8");
}
let output = solc.compile({ sources: input }, 1);
let solInterfaces = [];
for (let contractName in output.contracts) {
    console.log(contractName + "interface");
    console.log(solInterfaces[contractName] = output.contracts[contractName].interface);
}

module.exports = output;

