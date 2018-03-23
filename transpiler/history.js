const assert = require("assert");
const dic = require("./soltogo-dictionary");
const gf = require("./gf.js");
const gc = require("./gc.js");

module.exports = {

    startVersion:  "",
    endVersion: "",

    //identifiersSU: new Set(),
    //identifiersInSU: new Set(),

    publicFunctions: new Map(),
    publicTypes: new Map(),
    publicStateVariables: new Map(),
    publicConstants: new Map(),

    stateVariablesInitCode: new Map(),
    sourceUnits: new Map(),
/*
    expandType: function(typeName, parent) {
        if (dic.valueTypes.has(typeName)) {
            return dic.valueTypes.get(typeName);
        } else {
            if (!this.sourceUnits.has(parent.name))
                assert(this.sourceUnits.has(parent.name));
            if (this.sourceUnits.get(parent.name).identifiers.has(typeName)) {
                let typeNode = this.sourceUnits.get(parent.name).identifiers.get(typeName);
                if (typeNode.type === "EnumDeclaration") {
                    return "int";
                } else {
                    return typeNode.name + "_" + parent.name;
                }
            } else {
                throw(new Error("used unknown type " + typeName + " in " + parent));
            }
        }
    },
*/
    validInheritance: function(bases) {
        assert(bases instanceof Array);
        for ( let i = 0 ; i < bases.length ; i++ ) {
            if (this.sourceUnits.has(bases[i].name)) {
                let nextBase = this.sourceUnits.get(bases[i].name);
                if (nextBase.type !== "contract" && nextBase.type !== "interface")
                    throw( new Error("Base is not a contract or an interface"));
                for ( let baseBase of nextBase.bases) {
                    for ( let k = i+1 ; k < bases.length ; k++ ) {
                        if (baseBase === bases[k].name) {
                            throw( new Error("Linearization of inheritance graph impossible"));
                        }
                    }
                }
            }
            else {
                throw( new Error("unknown base- " + bases[i].type + " start-" + bases[i].start ));
            }
        }
        return true;
    },

    addContract: function(node) {
        if (this.sourceUnits.has(node.name))
            throw(new Error("Contract identifier " + node.name + " already used"));

        this.sourceUnits.set(node.name, {});
        let contractData = this.sourceUnits.get(node.name);

        contractData.type = "contract";
        contractData.identifiers = new Map();
        contractData.constants = new Map;
        contractData.stateVariables = new Map;
        contractData.functions = new Map;
        contractData.dataTypes = new Map;

        contractData.externalInterface = new Map;
        contractData.publicInterface = new Map;
        contractData.internalInterface = new Map;

        contractData.bases = []; //var merged = new Map([...map1, ...map2, ...map3])
        for ( let i = 0 ; i < node.is.length ; i++ ) {
            contractData.bases.push(node.is[i].name);
            let baseData = this.sourceUnits.get(node.is[i].name);
            contractData.identifiers = new Map([...baseData.identifiers, ...contractData.identifiers]);
            contractData.constants = new Map([...baseData.constants, ...contractData.constants]);
            contractData.stateVariables = new Map([...baseData.stateVariables, ...contractData.stateVariables]);
            contractData.functions = new Map([...baseData.functions, ...contractData.functions]);
            contractData.dataTypes = new Map([...baseData.dataTypes, ...contractData.dataTypes]);
        }
    },

    addInterface: function(node) {
        if (this.sourceUnits.has(node.name))
            throw(new Error("Interface identifier " + node.name + " already used"));
        this.sourceUnits.set(node.name, this.emptyInterface);
        this.identifiersSU.add(node.name);
    },

    addLibrary: function(node) {
        if (this.sourceUnits.has(node.name))
            throw(new Error("Library identifier " + node.name + " already used"));
        this.sourceUnits.set(node.name, this.emptyLibrary);
    },

    addIdentifier: function(node, parent) {
        let dataType;
        if (node.literal && node.literal.type === "Type")
            dataType = gf.typeOf(node.literal, this, parent);
        return this.addIdName(node, node.name, node.visibility, node.type, parent, dataType);
    },

    addIdName: function(node, name, visibility, nodeType, parent, dataType) {
        assert(parent && this.sourceUnits.has(parent.name));
        assert(this.sourceUnits.get(parent.name).identifiers);
        if (dataType)
            dataType = dataType.trim();
        let localHistory = require("./history-local.js");

        if (dic.valueTypes.has(name))
            throw(new Error(node,name + " already defined basic type"));


        if (this.sourceUnits.get(parent.name).identifiers.has(name)) {
            //throw(new Error("identifier " + name + " already declared in " + parent.name));
        }
        this.sourceUnits.get(parent.name).identifiers.set(name, node);
        let goId = "";
        if (visibility === "public" || visibility === "external") {
            goId = name.charAt(0).toUpperCase() + name.slice(1);
        } else {
            goId = gc.hideFuncPrefix + name;
            goId += (gc.suffixContract) ? "_" + parent.name : "";
        }

        switch (nodeType) {
            case "StateVariableDeclaration":
                goId = "this.get(\"" + name + "\").(" + dataType + ")";
                if (node.is_constant) {
                    assert(node.value, "error getting constant value");
                    if (dataType === "string") {
                        this.sourceUnits.get(parent.name).constants.set(name, "\"" + gf.getValue(node.value, this, parent) + "\"");
                    } else {
                        this.sourceUnits.get(parent.name).constants.set(name, gf.getValue(node.value, this, parent));
                    }
                } else if (visibility === "public") {
                    if (this.publicStateVariables.has(name))
                        throw(new Error(name + "already defined as public state variable"));
                    else
                        this.publicStateVariables.set(
                            name, {node: node, parent: parent, goName: goId, dataType: dataType})
                } else {

                    this.sourceUnits.get(parent.name).stateVariables.set(
                        name, {node: node, parent: parent, goName: goId, dataType: dataType})
                }
                break;
            case "EnumDeclaration":
            case "StructDeclaration":
                if (visibility === "public") {
                    if (this.publicTypes.has(name)) {

                    } else
                        this.publicTypes.set(name, {node: node, parent: parent, goName: goId})
                } else {
                    this.sourceUnits.get(parent.name).dataTypes.set(
                        name, {node: node, parent: parent, goName: goId})
                }
                break;
            case "FunctionDeclaration":
                if (visibility === "public" || visibility === "external") {
                    if (this.publicFunctions.has(name)) {

                        //throw(new Error(name + "already defined as public function"));
                    } else {
                        this.publicFunctions.set(
                            name, {node: node, parent: parent, goName: goId, localHistory: localHistory})
                    }
                } else {
                    this.sourceUnits.get(parent.name).functions.set(
                        name, {node: node, parent: parent, goName: goId, localHistory: localHistory})
                }
                break;
            case "EventDeclaration":
                break; //todo eventDeclartion
            case "ModifierDeclaration":
                break; //todo modifier declartion
            default:
                assert(false, "unknown identifier type") //todo
        }
    },

    getStorageType: function(id, parent, localHistory) {
        if (this.publicFunctions.has(id)) {
            return "function";
        } else if (this.publicTypes.has(id)) {
            return "type";
        }  else if (this.publicStateVariables.has(id)) {
            return "stateVariable";
        } else if (this.publicConstants.has(id)) {
            return "constant";

        } else if (this.sourceUnits.get(parent.name).functions.has(id)) {
            return "function";
        } else if (this.sourceUnits.get(parent.name).dataTypes.has(id)) {
            return "type";
        }  else if (this.sourceUnits.get(parent.name).stateVariables.has(id)) {
            return "stateVariable";
        } else if (this.sourceUnits.get(parent.name).constants.has(id)) {
            return "constant";

        } else if (localHistory) {
            if (localHistory.variables.has(id)) {
                return localHistory.variables.get(id).isMemory ? "memory" : "alias";
            } else if (localHistory.constants.has(id)) {
                return "constant";
            }
         }
    },

    findIdData: function(id, parent, localHistory) {
        if (this.publicFunctions.has(id)) {
            return this.publicFunctions.get(id);
        } else if (this.publicTypes.has(id)) {
            return this.publicTypes.get(id);
        }  else if (this.publicStateVariables.has(id)) {
            return this.publicStateVariables.get(id);
        } else if (this.publicConstants.has(id)) {
            return this.publicConstants.get(id);

        } else if (this.sourceUnits.get(parent.name).functions.has(id)) {
            return this.sourceUnits.get(parent.name).functions.get(id);
        } else if (this.sourceUnits.get(parent.name).dataTypes.has(id)) {
            return this.sourceUnits.get(parent.name).dataTypes.get(id);
        }  else if (this.sourceUnits.get(parent.name).stateVariables.has(id)) {
            return this.sourceUnits.get(parent.name).stateVariables.get(id);
        } else if (this.sourceUnits.get(parent.name).constants.has(id)) {
            return this.sourceUnits.get(parent.name).constants.get(id);
        } else if (localHistory) {
            if (localHistory.variables.has(id)) {
                return localHistory.variables.get(id)
            } else if (localHistory.constants.has(id)) {
                return localHistory.constants.get(id)
            }
        }
        assert(false, "cannot find identifier");
    }

};