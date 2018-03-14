'use strict';
const assert = require("assert");
const stateVariable = require("./element-state-variable.js");
const functionElement = require("./element-function.js");
const structElement = require("./element-struct.js");
const enumElement = require("./element-enum.js");
const gf = require("./gf.js");

module.exports = {

    codeDataStruct: function(nodeArray, history, parent, unitType) {
        assert(nodeArray);
        assert(nodeArray instanceof Array);
        let goCode = "";
        for (let node of nodeArray) {
            if (node.type === "FunctionDeclaration") {
                this.setFuncVisibility(node);
                assert(node.visibility !== undefined);
            }
            this.checkElement(node, history, unitType);
            history.addIdentifier(node, parent);
        }
        return goCode;
    },

    codeConstructor: function(nodeArray, history, parent) {
        assert(nodeArray);
        assert(nodeArray instanceof Array);

        let goCodeBases = "";
        for (let base of parent.is) {
            goCodeBases += history.stateVariablesInitCode[base.name];
        }
        let goCodeDerived = ""
        for (let node of nodeArray) {
            let SvName = node.name;
            if (!node.visibility || node.visibility === "public")
                SvName = node.name.charAt(0).toUpperCase() + node.name.slice(1);

            if (node.type === "StateVariableDeclaration") {
                goCodeDerived += "\tp.set(\"" + SvName + "\", ";
                if (node.value && node.value.value) {
                    goCodeDerived += node.value.value;
                } else {
                    if (node.literal.literal.type === "MappingExpression") {
                        goCodeDerived += " make(" + gf.typeOf(node.literal, history, parent) + ")"
                    } else {
                        goCodeDerived += " new(" + gf.typeOf(node.literal, history, parent) + ")";
                    }
                }
                goCodeDerived += ")\n";
            }
        }
        history.stateVariablesInitCode[parent.name] = goCodeDerived;

        return goCodeBases + goCodeDerived;
    },

    codePublicInterface: function(nodeArray, history, parent) {
        assert(nodeArray);
        assert(nodeArray instanceof Array);
        let goCode = "";
        for (let node of nodeArray) {
            if (node.type === "StateVariableDeclaration" && node.visibility === "public") {
                goCode += stateVariable.codeAccessorSig(node, history, parent)
            } else if (node.type === "FunctionDeclaration") {
                if (node.visibility === "public") {
                    goCode += functionElement.codeSignature(node, history, parent);
                }
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
                goCode +=  functionElement.codeSignature(node, history,  parent);
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
                goCode +=  functionElement.codeSignature(node, history,  parent);
            } else if (node.type === "StateVariableDeclaration"
                && (node.visibility === "internal")) {
                goCode += stateVariable.codeAccessorSig(node, history, parent)
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
                goCode +=  functionElement.codeSignature(node, history,  parent);
            } else if (node.type === "StateVariableDeclaration" && node.visibility === "private") {
                goCode += stateVariable.codeAccessorSig(node, history, parent)
            }
        }
        return goCode;
    },

    codeDeclarations: function(nodeArray, history,  parent) {
        assert(nodeArray);
        assert(nodeArray instanceof Array);
        let goCode = "";
        for (let node of nodeArray) {
            switch (node.type) {
                case "StateVariableDeclaration":
                    goCode += stateVariable.codeAccessors(node, history, parent);
                    break;
                case "StructDeclaration":
                    goCode +=  structElement.code(node, history, parent);
                    break;
                case "FunctionDeclaration":
                    goCode +=  functionElement.codeFunction(node, history, parent);
                    break;
                case "EnumDeclaration":
                    goCode += enumElement.code(node, history, parent);
                    break;
                default:
                    //assert(false, "declarations, node type not implemented")
            }
        }
        return goCode;
    },

    checkElement: function(node, history, unitType) {
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
    },

    setFuncVisibility: function(node){
        assert(node.type === "FunctionDeclaration");

        if (!node.modifiers || !(node.modifiers instanceof Array)) {
            node.visibility = "public";
            return;
        } else {
            for (let modifier of node.modifiers) {
                switch (modifier.name) {
                    case "external":
                        node.visibility = "external";
                        return;
                    case "internal":
                        node.visibility = "internal";
                        return;
                    case "public":
                        node.visibility = "public";
                        return;
                    case "private":
                        node.visibility = "private";
                        return;
                    default:
                }
            }
        }
        node.visibility = "public";
    }

};