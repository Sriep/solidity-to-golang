'use strict';
const assert = require("assert");
const gc = require("./gc.js");
const history = require("./history.js");
const sourceElements = require("./source-elements.js");

module.exports = {

    structName: function(name) {
        return name + "_S";
    },

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
                return this.codePragma(node, history);
            case "ContractStatement":
                return this.codeContract(node, history);
            case "InterfaceStatement":
                return this.codeInterface(node, history);
            case "LibraryStatement":
                return this.codeLibrary(node, history);
            case "InportStatement":
                console.log("Import command not supported. Flatten code first.");
                console.log("node-" + node.type + ' start-' + node.start + ' end-' + node.end);
                throw (new Error("Inport command not supported. Flatten code first."));
            default:
                console.log("unexpected type- " + node.type + " start-" + node.start);
                throw (new Error("Unrecognised source unit found."));
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
            throw (new Error("No contarct name"));
        }

        let goCode = "\n";
        goCode += "\n\\***************** " + node.name + " start struct declarations " + " *****************\n";
        goCode += "type " + this.structName(node.name) + " struct {\n";
        if (node.is instanceof Array) {
            if (!history.validInheritance(node.is))
                return;
            for (let base of node.is) {
                console.log("derived from-" + base.name);
                goCode += "\t" + this.structName(base.name) + "\n";
            }
        }

        history.addContract(node);
        goCode += sourceElements.codeBody(node.body, history, "contract", node.name);
        goCode += "\n}\n";

        goCode += "\n\\***************** " + node.name + " start interface declarations " + " *****************\n";
        goCode += "type " + node.name + " interface {\n";
        for (let base of node.is) {
            goCode += "\t" + base.name + "\n";
        }
        goCode += sourceElements.codeInterface(node.body, history, "contract", node.name);
        goCode += "\n}\n";

        goCode += "\n\\***************** " + node.name + " start external declarations " + " *****************\n";
        goCode += sourceElements.codeExternal(node.body, history, "contract", node.name);
        goCode += "\n\\***************** " + node.name + " end external declarations " + " *****************\n\n";
        return goCode;
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