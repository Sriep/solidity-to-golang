'use strict';
const assert = require("assert");
const gc = require("./gc.js");
const stateVariable = require("./element-state-variable.js");
const enumElement = require("./element-enum.js");
const eventElement = require("./element-event.js");
const modifierElement = require("./element-modifier.js");
const functionElement = require("./element-function.js");
const structElement = require("./element-struct.js");
const usingElement = require("./element-using.js");

module.exports = {

    codeDataStruct: function(nodeArray, history, parent, unitType) {
        assert(nodeArray);
        assert(nodeArray instanceof Array);
        let goCode = "";
        for (let node of nodeArray) {
            this.checkElement(node, history, unitType,  parent);
            history.addIdentifier(node, parent);
            if (node.type === "StateVariableDeclaration")
                goCode +=  stateVariable.code(node, history,  parent, true);
        }
        return goCode;
    },

    codePublicInterface: function(nodeArray, history, parent) {
        assert(nodeArray);
        assert(nodeArray instanceof Array);
        let goCode = "";
        for (let node of nodeArray) {
            if (node.type === "FunctionDeclaration"
                && (node.visibility === "public" || !node.visibility)) {
                goCode +=  functionElement.codeSignature(node, history,  parent,  false);
            } else if (node.type === "StateVariableDeclaration" && node.visibility === "public") {
                goCode += stateVariable.codeAccessorSig(node, history, parent, false)
            }
        }
        return goCode;
    },

    codeExternalInterface: function(nodeArray, history,  parent) {
        assert(nodeArray);
        assert(nodeArray instanceof Array);
        let goCode = "";
        for (let node of nodeArray) {
            if (node.type === "FunctionDeclaration" && node.visibility === "external") {
                goCode +=  functionElement.codeSignature(node, history,  parent, false);
            }
        }
        return goCode;
    },
    codeInternalInterface: function(nodeArray, history,  parent) {
        assert(nodeArray);
        assert(nodeArray instanceof Array);
        let goCode = "";
        for (let node of nodeArray) {
            if (node.type === "FunctionDeclaration" && node.visibility === "internal" ) {
                goCode +=  functionElement.codeSignature(node, history,  parent, true);
            } else if (node.type === "StateVariableDeclaration"
                && (node.visibility === "internal" || !node.visibility)) {
                goCode += stateVariable.codeAccessorSig(node, history, parent, true)
            }
        }
        return goCode;
    },

    codePrivateInterface: function(nodeArray, history,  parent) {
        assert(nodeArray);
        assert(nodeArray instanceof Array);
        let goCode = "";
        for (let node of nodeArray) {
            if (node.type === "FunctionDeclaration" && node.visibility === "private" ) {
                goCode +=  functionElement.codeSignature(node, history,  parent, true);
            } else if (node.type === "StateVariableDeclaration" && node.visibility === "private") {
                goCode += stateVariable.codeAccessorSig(node, history, parent, true)
            }
        }
        return goCode;
    },

    codeDeclarations: function(node, history,  parent) {
        return "";
    },

    checkElement: function(node, history, unitType, parent) {
        assert(node, "missing node");
        assert(!(node instanceof Array), "unexpected node array");

        switch (node.type) {
            case "StateVariableDeclaration":
                if (unitType === "contract" || unitType === "library") {
                    throw (new Error(unitType + " cannot have state variables declarations"));
                }
                break;
            case "EnumDeclaration":
                if (unitType === "contract" || unitType === "library") {
                    throw (new Error(unitType + " cannot have enum declarations"));
                }
                break;
            case "EventDeclaration":
                if (unitType === "contract" || unitType === "library" || unitType === "interface") {
                    throw (new Error(unitType + " cannot have event declarations"));
                }
                break;
            case "StructDeclaration":
                if (unitType === "contract" || unitType === "library") {
                    throw (new Error(unitType + " cannot have struct declarations"));
                }
                break;
            case "ModifierDeclaration":
                if (unitType === "contract" || unitType === "library" || unitType === "interface") {
                    throw (new Error(unitType + " cannot have modifier declarations"));
                }
                break;
            case "FunctionDeclaration":
                if (unitType === "contract" || unitType === "library" || unitType === "interface") {
                    throw (new Error(unitType + " cannot have function declarations"));
                }
                break;
            case "UsingStatement":
                if (unitType === "contract" || unitType === "library" || unitType === "interface") {
                    throw (new Error(unitType + " cannot have using statements"));
                }
                break;
            default:
                throw (new Error("Unrecognised source element" + node.type));
        }
    }

};