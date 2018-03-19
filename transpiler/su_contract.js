'use strict';
const assert = require("assert");
const gc = require("./gc.js");
const sourceElements = require("./source-elements.js");
const functionElement = require("./element-function.js");

module.exports = {

    codeContract: function(node, history, abi) {
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

        goCode += this.codeDataStruct(node, history, abi);
        goCode += this.codePublicInterface(node, history);
        goCode += this.codeExternalInterface(node, history);
        goCode += this.codeInternalInterface(node, history);
        goCode += this.codePrivateInterface(node, history);
        goCode += this.codeConstructor(node, history);
        goCode += this.codeDeclarations(node, history);

        //goCode += "\n//***************** " + node.name + " end declarations " + " *****************\n\n";
        return goCode;
    },

    codePublicInterface: function(node, history) {
        let goCode = "type ";
        goCode += gc.publicIPrefix +  node.name  + gc.publicISuffix;
        goCode += " interface {\n";
        goCode += this.codeBases(node, history, gc.publicIPrefix, gc.publicISuffix);
        goCode += sourceElements.codePublicInterface(node.body, history, node);
        goCode += "\n}\n";
        return goCode;
    },

    codeExternalInterface: function(node, history) {
        let goCode = "type ";
        goCode +=   node.name;
        goCode += " interface {\n";
        goCode += this.codeBases(node, history, "", "");
        goCode += "\t" + gc.publicIPrefix +  node.name  + gc.publicISuffix + "\n";
        goCode += sourceElements.codeExternalInterface(node.body, history, node.name);
        goCode += "\n}\n";
        return goCode;
    },

    codeInternalInterface: function(node, history) {
        let goCode = "type ";
        goCode += gc.internalIPrefix +  node.name  + gc.internalISuffix;
        goCode += " interface {\n";
        goCode += this.codeBases(node, history, gc.internalIPrefix, gc.internalISuffix);
        goCode += "\t" + gc.publicIPrefix +  node.name  + gc.publicISuffix + "\n";
        goCode += sourceElements.codeInternalInterface(node.body, history, node.name);
        goCode += "\n}\n";
        return goCode;
    },

    codePrivateInterface: function(node, history) {
        let goCode = "type ";
        goCode += gc.privateIPrefix +  node.name  + gc.privateISuffix;
        goCode += " interface {\n";
        goCode += this.codeBases(node, history, gc.privateIPrefix, gc.privateISuffix);
        goCode += "\t" + gc.internalIPrefix +  node.name  + gc.internalISuffix + "\n";
        goCode += sourceElements.codePrivateInterface(node.body, history, node.name);
        goCode += "\n}\n";
        return goCode;
    },

    codeDataStruct: function(node, history, abi) {
        let goCode = "type ";
        goCode += gc.structPrefix + node.name + gc.structSuffix;
        goCode += " struct {\n";
        //goCode += this.codeBases(node, history, gc.structPrefix, gc.structSuffix);
        goCode += sourceElements.codeDataStruct(node.body, history, node, abi);
        goCode += "\tContract\n";
        goCode += "\tthis *" + gc.structPrefix + node.name + gc.structSuffix + "\n";
        goCode += "}\n";
        return goCode;
    },

    codeConstructor: function(node, history) {
        let goCode = "func New" + node.name ;
        goCode += this.getConstructorParameters(node, history);
        goCode += " (*";
        goCode += gc.structPrefix + node.name + gc.structSuffix + ") {\n";
        goCode += "\tp := new(" + gc.structPrefix +  node.name  + gc.structSuffix + ")\n";
        goCode +=  "\tp.this = p\n";
        goCode +=  "\tp.createStorage()\n";
        goCode += sourceElements.codeConstructorBody(node.body, history, node);
        let constructorCall = this.getConstructorCall(node);
        if (constructorCall)
            goCode += "\t" + constructorCall + "\n";
        goCode += "\treturn p\n";
        goCode += "}\n\n";
        return goCode;
    },

    getConstructorParameters: function(node, history) {
        assert(node && node.body instanceof Array);
        for ( let item of node.body ) {
            if ( item.type === "FunctionDeclaration" && item.name === node.name ) {
                return functionElement.codeFunctionParameters(item.params, history, node);
            }
        }
        return "()";
    },

    getConstructorCall: function(node) {
        assert(node && node.body instanceof Array);
        let goCode = "";
        for ( let item of node.body ) {
            if ( item.type === "FunctionDeclaration" && item.name === node.name ) {
                goCode = "p." + gc.constructorPrefix + node.name;
                goCode += functionElement.codeFunctionArguments(item.params);
                return goCode;
            }
        }
        return "";
    },

    codeDeclarations: function(node, history) {
        return sourceElements.codeDeclarations(node.body, history, node);
    },

    codeBases: function(node, history, pefix, suffix) {
        let goCode = "";
        if (node.is instanceof Array) {
            if (!history.validInheritance(node.is))
                return;
            for (let base of node.is) {
                console.log("derived from-" + base.name);
                goCode += "\t" + pefix +  base.name + suffix + "\n";
            }
        }
        return goCode;
    },
};