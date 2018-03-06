const assert = require("assert");
const dic = require("./soltogo-dictionary");

module.exports = {

    startVersion:  "",
    endVersion: "",

    identifiersSU: new Set(),
    identifiersInSU: new Set(),

    sourceUnits: new Map(),

    expandType: function(typeName, parent) {
        if (dic.valueTypes.has(typeName)) {
            return dic.valueTypes.get(typeName);
        } else {
            assert(this.sourceUnits.has(parent));
            if (this.sourceUnits.get(parent).identifiers.has(typeName)) {
                let typeNode = this.sourceUnits.get(parent).identifiers.get(typeName);
                return typeNode.name + "_" + parent;
            } else {
                throw(new Error("used unknown type " + typeName + " in " + parent));
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
        this.sourceUnits.get(node.name).type = "contract";
        this.sourceUnits.get(node.name).identifiers = new Map();
        this.sourceUnits.get(node.name).bases = [];
        for ( let i = 0 ; i < node.is.length ; i++ ) {
            let a = this.sourceUnits.get(node.name);
            let b = this.sourceUnits.get(node.name).bases;
            assert( a && b);
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

    addIdentifier: function(node, parent) {
        assert(parent && this.sourceUnits.has(parent));
        assert(this.sourceUnits.get(parent).identifiers);

        if (dic.valueTypes.has(node.name))
            throw(new Error(node,name + " already defined basic type"));
        if (this.identifiersSU.has(node.name) && node.name !== parent) {
            throw(new Error("identifier " + node.name + " already used for storage unit."));
        }
        if (this.identifiersInSU.has(node.name)) {
            console.log("identifier " + node.name + " shadows previous declaration");
        }

        if (this.sourceUnits.get(parent).identifiers.has(node.name)) {
            throw(new Error("identifier " + node.name + " already declared in " + parent));
        }
        this.sourceUnits.get(parent).identifiers.set(node.name, node);
        this.identifiersInSU.add(node.name);
    },
};