const assert = require("assert");
const dic = require("./soltogo-dictionary");

module.exports = {

    startVersion:  "",
    endVersion: "",

    identifiersSU: new Set(),
    identifiersInSU: new Set(),

    sourceUnits: new Map(),
    emptyContract: {
        type: "contract",
        varDec: new Map(),
        typeDec: new Map(),
        bases: []
    },
    emptyInterface: {
        type: "interface",
        varDec: new Map(),
        typeDec: new Map()
    },
    emptyLibrary: {
        type: "contract",
        varDec: new Map(),
        typeDec: new Map()
    },

    addType: function(newType, parent, goCode) {
        assert(parent && this.sourceUnits.has(parent));

        if (dic.valueTypes.has(newType))
            throw(new Error(newType + " already defined basic type"));

        if (!this.sourceUnits.get(parent).typeDec.has(newType)) {
            goCode = goCode.replace(/\t/g,"");
            goCode = goCode.replace(/\n/g,"");
            this.sourceUnits.get(parent).typeDec.set(newType, goCode);
        } else {
            throw(new Error( newType + " already declared in " + parent));
        }
    },

    expandType: function(typeName, parent) {
        if (dic.valueTypes.has(typeName)) {
            return dic.valueTypes.get(typeName);
        } else {
            assert(this.sourceUnits.has(parent));
            if (this.sourceUnits.get(parent).typeDec.has(typeName)) {
                return this.sourceUnits.get(parent).typeDec.get(typeName);
            } else {
                throw(new Error("used unfimilar type " + typeName + " in " + parent));
            }
        }
    },

    validInheritance: function(bases) {
        assert(bases instanceof Array);
        for ( let i = 0 ; i < bases.length ; i++ ) {
            if (this.sourceUnits.has(bases[i].name)) {
                let nextBase = this.sourceUnits.get(bases[i].name);
                if (nextBase.type !== "contract" && nextBase.type !== "interface")
                    throw( new Error("Base is not a contract or an interface"));
                for ( let j in nextBase.bases) {
                    let baseBase = nextBase.bases[j];
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

        this.sourceUnits.set(node.name, this.emptyContract);
        for ( let i = 0 ; i < node.is.length ; i++ ) {
            this.sourceUnits.get(node.name).bases.push(node.is[i].name);
        }
        this.identifiersSU.add(node.name);
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
        this.identifiersSU.add(node.name);
    },

    addStateVariable: function(node, parent) {
        if (!this.sourceUnits.has(parent))
            throw(new Error("can not find source unit " + parent));

        if (this.identifiersSU.has(node.name)) {
            throw(new Error("state variable identifier " + name + " already used for storage unit."));
        }
        if (this.identifiersInSU.has(node.name)) {
            console.log("state variable identifier " + name + " shadows previous declaration");
        }

        assert(this.sourceUnits.get(parent).varDec);
        if (this.sourceUnits.get(parent).varDec.has(node.name)) {
            throw(new Error("state variable identifier " + node.name + " already used in " + parent));
        }
        this.sourceUnits.get(parent).varDec.set(node.name, node);
        this.identifiersInSU.add(node.name);
    }
};