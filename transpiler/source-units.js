'use strict';
const assert = require("assert");
const history = require("./history.js");
const sourceElements = require("./source-elements.js");
const suPragma = require("./su-pragma.js");
const suContract = require("./su_contract.js");

module.exports = {

    code: function(node) {
        if (node instanceof Array) {
            console.log("Source units array found.");
            let goCode = "";
            for (let item of node) {
                console.log("Contract type item-" + item);
                goCode += this.codeUnit(item, history);
                assert(goCode !== undefined);
            }
            return goCode
        } else {
            console.log("No source units array found.");
            console.log("node-" + node.type + ' start-' + node.start + ' end-' + node.end);
            throw(new Error("No source units array found."));
        }
    },

    codeUnit: function(node, history) {
        if(node === undefined) {
            console.log("Undefined source unit");
            throw (new Error("Use of undefined source unit"));
        }
        if(node instanceof Array) {
            console.log("Unexpeted array instead of source unit");
            throw (new Error("Unexpeted array instead of source unit"));
        }
        console.log("Source unit-" + node.type + ' start-' + node.start + ' end-' + node.end);
        switch (node.type) {
            case "PragmaStatement":
                return suPragma.codePragma(node, history);
            case "ContractStatement":
                return suContract.codeContract(node, history);
            case "InterfaceStatement":
                return this.codeInterface(node, history);
            case "LibraryStatement":
                return this.codeLibrary(node, history);
            case "ImportStatement":
                console.log("Import command not supported. Flatten code first.");
                console.log("node-" + node.type + ' start-' + node.start + ' end-' + node.end);
                throw (new Error("Inport command not supported. Flatten code first."));
            default:
                console.log("unexpected type- " + node.type + " start-" + node.start);
                throw (new Error("Unrecognised source unit found."));
        }
    },

    codeInterface: function(node, history) {
        assert(node);
        assert(!(node instanceof Array));
        console.log("node-" + node.type + ' start-' + node.start + ' end-' + node.end);
        if (node.name === undefined ||  node.name === "") {
            console.log("No interface name");
            throw (new Error("No interface name"));
        }

        let goCode = "\n";
        goCode += "type " + node.name + " interface {\n";

        history.addInterface(node);

        goCode += sourceElements.codeBody(node.body, history, gc.SrcUnitInterface, node.name);
        goCode += "\n}\n";
        assert(goCode !== undefined);
        return goCode;
    },

    codeLibrary: function(node, history) {
        assert(node);
        assert(!(node instanceof Array));
        console.log("node-" + node.type + ' start-' + node.start + ' end-' + node.end);
        if (node.name === undefined ||  node.name === "") {
            throw (new Error("No library name"));
        }

        let goCode = "\n";
        goCode += "type " + node.name + " struct {\n";

        history.addLibrary(node);

        goCode += sourceElements.codeBody(node.body, history, gc.SrcUnitLibrary, node.name);
        goCode += "\n}\n";
        assert(goCode !== undefined);
        return goCode;
    }

};