'use strict';
const path = require("path");
const assert = require("assert");
const fs = require("fs");
const sourceUnits = require("./source-units.js");

module.exports = {

    prefixFile: "./transpiler/data/prefix.sol",
    suffixFile: "./transpiler/data/suffix.sol",

    compileToGoToFile: function(ast, outputFile) {
        let data = this.compileToGo(ast, outputFile);
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
    },

    compileToGo: function(ast, outputFile) {
        let output = this.codeProgram(ast, outputFile);

        console.log(JSON.stringify(ast, null, 2));
        return output;
    },

    codeProgram: function(node, outputFile) {
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
            goCode +=  sourceUnits.code(node.body);
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