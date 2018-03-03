const path = require("path");
const assert = require('assert');
const history = require('./history.js');

module.exports = {

    compileToGoToFile: function(ast, outputFile) {
        let data = this.compileToGo(ast);
        if(outputFile == null ||  outputFile ==='') {
            //ouput to stdout,
            return console.log(data)
        }
        let fs = require('fs');
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
            let gcCode = "package main\n\n";
            newGoCode =  this.codeSourceUnitsArray(node.body);
            if (newGoCode !== undefined) {
                gcCode += newGoCode;
                gcCode += "\nfunc main() {\n}\n";
                return gcCode;
            }
        } else {
            console.log("Not a program");
            console.log("node-" + node.type + ' start-' + node.start + ' end-' + node.end);
        }
    },

    codeSourceUnitsArray: function(node) {
        if (node instanceof Array) {
            console.log("Source units array found.");
            let goCode = "";
            for (let item of node) {
                console.log("Contract type item-" + item);
                newGoCode = this.codeSourceUnit(item, history);
                if (newGoCode === undefined) {
                    console.log("Failed compulation");
                    return;
                }
                goCode += newGoCode;
            }
            return goCode
        } else {
            console.log("No source units array found.");
            console.log("node-" + node.type + ' start-' + node.start + ' end-' + node.end);
        }
    },

    codeSourceUnit: function(node, history) {
        if(node === undefined) {
            console.log("Undefined source unit");
            return;
        }
        if(node instanceof Array) {
            console.log("Unexpeted array instead of source unit");
            return;
        }
        console.log("Source unit-" + node.type + ' start-' + node.start + ' end-' + node.end);
        switch (node.type) {
            case "PragmaStatement":
                return this.codePragma(node, history);
            case "ContractStatement":
                return this.codeContract(node, history);
            case "InterfaceStatement":
                return this.codeInterface(node, history);
            case "LibraryStatement":
                return this.codeLibrary(node, history);
            case "InportStatement":
                console.log("Inport command not supported. Flatten code first.");
                console.log("Will try ignoring the inport stament.");
                console.log("node-" + node.type + ' start-' + node.start + ' end-' + node.end);
                return;
            default:
                console.log("unexpected type- " + node.type + " start-" + node.start);
                console.log("Will try ignoring.");
                return;
        }
    },

    codePragma: function(node, history) {
        assert(node);
        assert(!(node instanceof Array));
        console.log("node-" + node.type + ' start-' + node.start + ' end-' + node.end);
        if (node.start_version
            && node.start_version.operator === "^"
            && node.start_version.type === "VersionLiteral")
        {
            history.startVersion = node.start_version.version;
            console.log("Set start verion to" + history.startVersion);
        }
        if (node.end_version
            && node.end_version.operator === "^"
            && node.end_version.type === "VersionLiteral")
        {
            history.endVersion = node.end_version.version;
            console.log("Set end verion to" + history.endVersion);
        }
        return "";
    },

    codeContract: function(node, history) {
        assert(node);
        assert(!(node instanceof Array));
        console.log("node-" + node.type + ' start-' + node.start + ' end-' + node.end);
        if (node.name === undefined ||  node.name === "") {
            console.log("No contract name");
            return;
        }

        let goCode = "\n";
        goCode += "type " + node.name + " struct {\n";

        if (node.is instanceof Array) {
            if (!history.validInheritance(node.is))
                return;
            for (let base of node.is) {
                console.log("derived from-" + base.name);
                goCode += "\t" + base.name + "\n";
            }
        }
        history.addContract(node);

        //Body gets done here.

        goCode += "}\n\n";
        return goCode;
    },

    codeInterface: function(node, history) {
        assert(node);
        assert(!(node instanceof Array));
        console.log("node-" + node.type + ' start-' + node.start + ' end-' + node.end);
        if (node.name === undefined ||  node.name === "") {
            console.log("No interface name");
            return;
        }

        let goCode = "\n";
        goCode += "type " + node.name + " interface {\n";

        history.addInterface(node);

        //Body gets done here.

        goCode += "}\n\n";
        return goCode;
    },

    codeLibrary: function(node, history) {
        assert(node);
        assert(!(node instanceof Array));
        console.log("node-" + node.type + ' start-' + node.start + ' end-' + node.end);
        if (node.name === undefined ||  node.name === "") {
            console.log("No interface name");
            return;
        }

        let goCode = "\n";
        goCode += "type " + node.name + " struct {\n";

        history.addLibrary(node);

        //Body gets done here.

        goCode += "}\n\n";
        return goCode;
    }

};