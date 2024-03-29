'use strict';
const path = require("path");
const assert = require("assert");
const fs = require("fs");
const sourceUnits = require("./source-units.js");
const abi = require("./abi.js");

module.exports = {

    prefixFile: "./transpiler/data/prefix.sol",
    suffixFile: "./transpiler/data/suffix.sol",

    compileToGoToFile: function(ast, outputFile, outputAbiFile) {
        let data = this.compileToGo(ast, outputFile, abi);
        if(outputFile == null ||  outputFile ==='') {
            //ouput to stdout,
            console.log("Error file was not saved to " + outputFile);
            return console.log(data)
        }
        fs.writeFile(path.resolve(outputFile), data, function(err) {
            if(err) {
                console.log("Error file was not saved to " + outputFile);
                return console.log(err);
            }
            console.log("The file was saved! to " + outputFile);
        });

        if(outputAbiFile == null ||  outputAbiFile ==='') {
            //ouput to stdout,
            console.log("Error file was not saved to " + outputFile);
            return console.log(data)
        }
        fs.writeFile(path.resolve(outputAbiFile), JSON.stringify(abi), function(err) {
            if(err) {
                console.log("Error ABI file was not saved to " + outputAbiFile);
                return console.log(err);
            }
            console.log("The ABI file was saved! to " + outputAbiFile);
        });
    },

    compileToGo: function(ast, outputFile, abi) {
        let output = this.codeProgram(ast, outputFile,abi);

        console.log(JSON.stringify(ast, null, 2));
        return output;
    },

    codeProgram: function(node, outputFile, abi) {
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
            let packageName = outputFile.replace(/\.[^/.]+$/, "");
            packageName = packageName.replace(/^.*[\\\/]/, '');
            let goCode = "package " + packageName;
            goCode += this.prefix();

            goCode +=  sourceUnits.code(node.body, abi);

            //goCode += this.suffix();
            assert(goCode !== undefined);
            return goCode;
        } else {
            console.log("Not a program");
            console.log("node-" + node.type + ' start-' + node.start + ' end-' + node.end);
        }
    },

    prefix: function() {
       // try {
            return fs.readFileSync(this.prefixFile,'utf8');
        //}
       // catch(e) {
       //     console.log(e.message);
        //    return "package main\n";
       // }

    },

    //suffix: function() {
        //try {
           // return fs.readFileSync(this.suffixFile,'utf8');
        //}
        //catch(e) {
        //    console.log(e.message);
       //     return "func main() {}\n";
        //}
    //}

};