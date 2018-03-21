'use strict';
const assert = require("assert");
const gc = require("./gc.js");
const gf = require("./gf.js");
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
        let pubInterface = this.getBasesInterface(node, history, "publicInterface");
        pubInterface = gf.mergeInterfaces(pubInterface, sourceElements.getPublicInterface(node.body, history, node));
        history.sourceUnits.get(node.name).publicInterface = pubInterface;
        goCode += sourceElements.codeInterface(pubInterface, history, node);
        goCode += "\n}\n";
        return goCode;
    },

    codeExternalInterface: function(node, history) {
        let goCode = "type ";
        goCode +=   node.name;
        goCode += " interface {\n";
        let externalInterface  = this.getBasesInterface(node, history, "externalInterface");
        externalInterface = gf.mergeInterfaces(externalInterface, sourceElements.getExternalInterface(node.body, history, node));
        externalInterface = gf.mergeInterfaces(externalInterface, sourceElements.getPublicInterface(node.body, history, node));
        history.sourceUnits.get(node.name).externalInterface = externalInterface;
        goCode += sourceElements.codeInterface(externalInterface, history, node);
        goCode += "\n}\n";
        return goCode;
    },

    codeInternalInterface: function(node, history) {
        let goCode = "type ";
        goCode += gc.internalIPrefix +  node.name  + gc.internalISuffix;
        goCode += " interface {\n";
        let internalInterface  = this.getBasesInterface(node, history, "internalInterface");
        internalInterface = gf.mergeInterfaces(internalInterface, sourceElements.getExternalInterface(node.body, history, node));
        internalInterface = gf.mergeInterfaces(internalInterface, sourceElements.getPublicInterface(node.body, history, node));
        internalInterface = gf.mergeInterfaces(internalInterface, sourceElements.getInternalInterface(node.body, history, node));
        history.sourceUnits.get(node.name).internalInterface = internalInterface;
        goCode += sourceElements.codeInterface(internalInterface, history, node);
        goCode += "\n}\n";
        return goCode;
    },

    codePrivateInterface: function(node, history) {
        let goCode = "type ";
        goCode += gc.privateIPrefix +  node.name  + gc.privateISuffix;
        goCode += " interface {\n";
        let privateInterface  = this.getBasesInterface(node, history, "internalInterface");
        privateInterface = gf.mergeInterfaces(privateInterface, sourceElements.getPublicInterface(node.body, history, node));
        privateInterface = gf.mergeInterfaces(privateInterface, sourceElements.getInternalInterface(node.body, history, node));
        privateInterface = gf.mergeInterfaces(privateInterface, sourceElements.getExternalInterface(node.body, history, node));
        history.sourceUnits.get(node.name).privateInterface = privateInterface;
        goCode += sourceElements.codeInterface(privateInterface, history, node);
        goCode += "\n}\n";
        return goCode;
    },

    codeDataStruct: function(node, history, abi) {
        let goCode = "type ";
        goCode += gc.structPrefix + node.name + gc.structSuffix;
        goCode += " struct {\n";
        goCode += "\tContract\n";
        goCode += this.codeBases(node, history, gc.structPrefix, gc.structSuffix);
        goCode += sourceElements.codeDataStruct(node.body, history, node, abi);
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

    getBasesInterface: function(node, history, interfaceType)  {
        let basesInterface = new Map;
        if (node.is instanceof Array) {
            if (!history.validInheritance(node.is))
                return;
            for (let base of node.is) {
                console.log("derived from-" + base.name);
                gf.mergeInterfaces(basesInterface, history.sourceUnits.get(base.name)[interfaceType]);
               /* switch (visibility) {
                    case "external":
                        gf.mergeInterfaces(basesInterface, history.sourceUnits.get(base.name).externalInterface);
                        break;
                    case "public":
                        gf.mergeInterfaces(basesInterface, history.sourceUnits.get(base.name).publicInterface);
                        break;
                    case "internal":
                        gf.mergeInterfaces(basesInterface, history.sourceUnits.get(base.name).internalInterface);
                        break;
                    default:
                        assert(false, "Invalid inheritence type in getBaseInterface");
                }*/
            }
        }
        return basesInterface;
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