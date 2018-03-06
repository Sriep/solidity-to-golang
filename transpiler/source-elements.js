'use strict';
const assert = require("assert");
const gc = require("./gc.js");
const stateVariable = require("./element-state-variable.js");
const enumDeclare = require("./element-enum.js");
const eventDeclare = require("./element-event.js");
const modifierDeclare = require("./element-modifier.js");
const functionDeclare = require("./element-function.js");
const structDeclare = require("./element-struct.js");
const usingDeclare = require("./element-using.js");

module.exports = {

    codeBody: function(nodeArray, history, unitType, parent) {
        assert(nodeArray);
        assert(nodeArray instanceof Array);
        let goCode = "";
        for (let node of nodeArray) {
            goCode += this.codeBodyElement(node, history, unitType, parent);
            console.log("Added element code now\n" + goCode );
            assert(goCode !== undefined, "coding element");
        }
        return goCode;
    },

    codeBodyElement: function(node, history, unitType, parent) {
        assert(node, "missing node");
        assert(!(node instanceof Array), "unexpected node array");

        switch (node.type) {
        case "StateVariableDeclaration":
            if (unitType === "contract" || unitType === "library") {
                history.addIdentifier(node, parent);
                return stateVariable.code(node, history,  parent);
            } else {
                throw (new Error(unitType + " cannot have state variables declarations"));
            }
        case "EnumDeclaration":
            if (unitType === "contract" || unitType === "library") {
                history.addIdentifier(node, parent);
                return "//Declared enumeration" + node.name + "\n";
            } else {
                throw (new Error(unitType + " cannot have enum declaraions"));
            }
        case "EventDeclaration":
            if (unitType === "contract" || unitType === "library" || unitType === "interface") {
                history.addIdentifier(node, parent);
                return "//Declared event " + node.name + "\n";
            } else {
                throw (new Error(unitType + " cannot have event declarations"));
            }
        case "StructDeclaration":
            if (unitType === "contract" || unitType === "library") {
                history.addIdentifier(node, parent);
                return "//Declared struct " + node.name + "\n";
            } else {
                throw (new Error(unitType + " cannot have struct declarations"));
            }
        case "ModifierDeclaration":
            if (unitType === "contract" || unitType === "library" || unitType === "interface") {
                history.addIdentifier(node, parent);
                return "//Declared modifier " + node.name + "\n";
            } else {
                throw (new Error(unitType + " cannot have modifier declarations"));
            }
        case "FunctionDeclaration":
            if (unitType === "contract" || unitType === "library" || unitType === "interface") {
                history.addIdentifier(node, parent);
                return "//Declared function " + node.name + "\n";
            } else {
                throw (new Error(unitType + " cannot have function declarations"));
            }
        case "UsingStatement":
            if (unitType === "contract" || unitType === "library" || unitType === "interface") {
                history.addIdentifier(node, parent);
                return "//Declared using for " + node.name + "\n";
            } else {
                throw (new Error(unitType + " cannot have using statments"));
            }
        default:
            throw (new Error("Unrecognised source element" + node.type));
        }
    },

    codeInterface: function(nodeArray, history, unitType, parent) {
        assert(nodeArray);
        assert(nodeArray instanceof Array);
        let goCode = "";
        for (let node of nodeArray) {
            goCode += this.codeInterfaceElement(node, history, unitType, parent);
            console.log("Added interface code now\n" + goCode );
            assert(goCode !== undefined, "coding element");
        }
        return goCode;
    },

    codeInterfaceElement: function(node, history, unitType, parent) {
        assert(node, "missing node");
        assert(!(node instanceof Array), "unexpected node array");

        switch (node.type) {
            case "StateVariableDeclaration":
                return stateVariable.codeInterface(node, history,  parent);
            case "EnumDeclaration":
                return enumDeclare.codeInterface(node, history,  parent);
            case "EventDeclaration":
                return eventDeclare.codeInterface(node, history,  parent);
            case "StructDeclaration":
                return structDeclare.codeInterface(node, history,  parent);
            case "ModifierDeclaration":
                return modifierDeclare.codeInterface(node, history,  parent);
            case "FunctionDeclaration":
                return functionDeclare.codeInterface(node, history,  parent);
            case "UsingStatement":
                return usingDeclare.codeInterface(node, history,  parent);
            default:
                throw (new Error("Unrecognised source element" + node.type));
        }
    },

    codeExternal: function(nodeArray, history, unitType, parent) {
        assert(nodeArray);
        assert(nodeArray instanceof Array);
        let goCode = "";
        for (let node of nodeArray) {
            goCode += this.codeExternalElement(node, history, unitType, parent);
            console.log("Added external element code now\n" + goCode );
            assert(goCode !== undefined, "coding element");
        }
        return goCode;
    },

    codeExternalElement: function(node, history, unitType, parent) {
        assert(node, "missing node");
        assert(!(node instanceof Array), "unexpected node array");

        switch (node.type) {
            case "StateVariableDeclaration":
                return stateVariable.codeExternal(node, history,  parent);
            case "EnumDeclaration":
                return enumDeclare.codeExternal(node, history,  parent);
            case "EventDeclaration":
                return eventDeclare.codeExternal(node, history,  parent);
            case "StructDeclaration":
                return structDeclare.codeExternal(node, history,  parent);
            case "ModifierDeclaration":
                return modifierDeclare.codeExternal(node, history,  parent);
            case "FunctionDeclaration":
                return functionDeclare.codeExternal(node, history,  parent);
            case "UsingStatement":
                return usingDeclare.codeExternal(node, history,  parent);
            default:
                throw (new Error("Unrecognised source element" + node.type));
        }
    }
};