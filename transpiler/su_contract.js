'use strict';
const assert = require("assert");
const gc = require("./gc.js");
const sourceElements = require("./source-elements.js");

module.exports = {

    codeContract: function(node, history) {
        assert(node);
        assert(!(node instanceof Array));
        console.log("node-" + node.type + ' start-' + node.start + ' end-' + node.end);
        if (node.name === undefined ||  node.name === "") {
            console.log("No contract name");
            throw (new Error("No contract name"));
        }

        let goCode = "\n";
        //goCode += "\n//***************** " + node.name + " start contract declarations " + " *****************\n";
        history.addContract(node);

        goCode += this.codeDataStruct(node, history);
        goCode += this.codePublicInterface(node, history);
        goCode += this.codeExternalInterface(node, history);
        goCode += this.codeInternalInterface(node, history);
        goCode += this.codePrivateInterface(node, history);
        goCode += this.codeDeclarations(node, history);

        //goCode += "\n//***************** " + node.name + " end declarations " + " *****************\n\n";
        return goCode;
    },

    codePublicInterface: function(node, history) {
        let goCode = "type ";
        goCode += gc.publicIPrefix +  node.name  + gc.publicISuffix;
        goCode += " interface {\n";
        goCode += this.codeBases(node, history, gc.publicIPrefix, gc.publicISuffix);
        goCode += sourceElements.codePublicInterface(node.body, history, "contract", node.name);
        goCode += "\n}\n";
        return goCode;
    },

    codeExternalInterface: function(node, history) {
        let goCode = "type ";
        goCode +=   node.name;
        goCode += " interface {\n";
        goCode += this.codeBases(node, history, "", "");
        goCode += "\t" + gc.publicIPrefix +  node.name  + gc.publicISuffix + "\n";
        goCode += sourceElements.codeExternalInterface(node.body, history, "contract", node.name);
        goCode += "\n}\n";
        return goCode;
    },

    codeInternalInterface: function(node, history) {
        let goCode = "type ";
        goCode += gc.internalIPrefix +  node.name  + gc.internalISuffix;
        goCode += " interface {\n";
        goCode += this.codeBases(node, history, gc.internalIPrefix, gc.internalISuffix);
        goCode += "\t" + gc.publicIPrefix +  node.name  + gc.publicISuffix + "\n";
        goCode += sourceElements.codeInternalInterface(node.body, history, "contract", node.name);
        goCode += "\n}\n";
        return goCode;
    },

    codePrivateInterface: function(node, history) {
        let goCode = "type ";
        goCode += gc.privateIPrefix +  node.name  + gc.privateISuffix;
        goCode += " interface {\n";
        goCode += this.codeBases(node, history, gc.privateIPrefix, gc.privateISuffix);
        goCode += "\t" + gc.internalIPrefix +  node.name  + gc.internalISuffix + "\n";
        goCode += sourceElements.codePrivateInterface(node.body, history, "contract", node.name);
        goCode += "\n}\n";
        return goCode;
    },

    codeDataStruct: function(node, history) {
        let goCode = "type ";
        goCode += gc.structPrefix + node.name + gc.structSuffix;
        goCode += " struct {\n";
        goCode += this.codeBases(node, history, gc.structPrefix, gc.structSuffix);
        goCode += sourceElements.codeDataStruct(node.body, history, "contract", node.name);
        goCode += "\n}\n";
        return goCode;
    },

    codeDeclarations: function(node, history) {
        return sourceElements.codeDeclarations(node.body, history, "contract", node.name);
    },

    codeBases: function(node, history, pefix, suffix) {
        let goCode = "";
        if (node.is instanceof Array) {
            if (!history.validInheritance(node.is))
                return;
            for (let base of node.is) {
                console.log("derived from-" + base.name);
                goCode += "\t" + pefix +  this.structName(base.name) + suffix + "\n";
            }
        }
        return goCode;
    },

    structName: function(name) {
        return name + "_S";
    },

};