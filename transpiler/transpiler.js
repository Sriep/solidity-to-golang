'use strict';
const path = require("path");
const assert = require("assert");
const fs = require("fs");
const sourceUnits = require("./source-units.js");

module.exports = {

    prefixFile: "./transpiler/data/prefix.sol",
    suffixFile: "./transpiler/data/suffix.sol",

    compileToGoToFile: function(ast, outputFile) {
        let data = this.compileToGo(ast);
        if(outputFile == null ||  outputFile ==='') {
            //ouput to stdout,
            return console.log(data)
        }
        fs.writeFile(path.resolve(outputFile), data, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    },

    compileToGo: function(ast) {
        let output = this.codeProgram(ast);

        console.log(JSON.stringify(ast, null, 2));
        return output;
    },

    codeProgram: function(node) {
        if(node === undefined) {
            console.log("undefined");
            return;
        }
        if(node instanceof Array) {
            console.log("Not a program");
            console.log("node-" + node.type + ' start-' + node.start + ' end-' + node.end);
            return;
        }
        if (node.type === "Program") {
            console.log("Found valid solidity program");
            let goCode = this.prefix();
            goCode +=  sourceUnits.code(node.body);
            goCode += this.suffix();
            assert(goCode !== undefined);
            return goCode;
        } else {
            console.log("Not a program");
            console.log("node-" + node.type + ' start-' + node.start + ' end-' + node.end);
        }
    },

    prefix: function() {
        try {
            return fs.readFileSync(this.prefixFile,'utf8');
        }
        catch(e) {
            console.log(e.message);
            return "package main\n";
        }

    },

    suffix: function() {
        try {
            return fs.readFileSync(this.suffixFile,'utf8');
        }
        catch(e) {
            console.log(e.message);
            return "func main() {}\n";
        }
    }

};