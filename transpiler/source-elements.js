'use strict';
const assert = require("assert");
const gc = require("./gc.js");
const stateVariableDeclare = require("./element-state-variable.js");
const enumDeclare = require("./element-enum.js");
const eventDeclare = require("./element-event.js");
const modifierDeclare = require("./element-modifier.js");
const functionDeclare = require("./element-function.js");
const structDeclare = require("./element-struct.js");
const usingDeclare = require("./element-using.js");

module.exports = {



    code: function(nodeArray, history, unitType, parent) {
        assert(nodeArray);
        assert(nodeArray instanceof Array);
        let goCode = "";
        for (let node of nodeArray) {
            goCode += this.codeElement(node, history, unitType, parent);
            console.log("Added elemnet code now\n" + goCode );
            assert(goCode !== undefined, "coding element");
        }
        return goCode;
    },

    codeElement: function(node, history, unitType, parent) {
        assert(node, "missing node");
        assert(!(node instanceof Array), "unexpected node array");

        switch (node.type) {
        case "StateVariableDeclaration":
            if (unitType === gc.SrcUnitContract || unitType === gc.SrcUnitLibrary) {
                return stateVariableDeclare.code(node, history,  parent);
            } else {
                throw (new Error(unitType + " cannot have state variables declarations"));
            }
        case "EnumDeclaration":
            if (unitType === gc.SrcUnitContract || unitType === gc.SrcUnitLibrary) {
                return enumDeclare.code(node, history,  parent);
            } else {
                throw (new Error(unitType + " cannot have enum declaraions"));
            }
        case "EventDeclaration":
            if (unitType === gc.SrcUnitContract
                || unitType === gc.SrcUnitLibrary
                || unitType === gc.SrcUnitInterface) {
                return eventDeclare.code(node, history,  parent);
            } else {
                throw (new Error(unitType + " cannot have event declarations"));
            }
        case "StructDeclaration":
            if (unitType === gc.SrcUnitContract || unitType === gc.SrcUnitLibrary) {
                return structDeclare.code(node, history,  parent);
            } else {
                throw (new Error(unitType + " cannot have struct declarations"));
            }
        case "ModifierDeclaration":
            if (unitType === gc.SrcUnitContract
                || unitType === gc.SrcUnitLibrary
                || unitType === gc.SrcUnitInterface) {
                return modifierDeclare.code(node, history,  parent);
            } else {
                throw (new Error(unitType + " cannot have modifier declarations"));
            }
        case "FunctionDeclaration":
            if (unitType === gc.SrcUnitContract
                || unitType === gc.SrcUnitLibrary
                || unitType === gc.SrcUnitInterface) {
                return functionDeclare.code(node, history,  parent);
            } else {
                throw (new Error(unitType + " cannot have function declarations"));
            }
        case "UsingStatement":
            if (unitType === gc.SrcUnitContract
                || unitType === gc.SrcUnitLibrary
                || unitType === gc.SrcUnitInterface) {
                return usingDeclare.code(node, history,  parent);
            } else {
                throw (new Error(unitType + " cannot have using statments"));
            }
        default:
            throw (new Error("Unrecognised source element" + node.type));
        }
    }

};