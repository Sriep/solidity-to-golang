const assert = require("assert");

module.exports = {

    startVersion:  "",
    endVersion: "",

    contracts: new Map(),
    interfaces: new Map(),
    libraries: new Map(),

    validInheritance: function(bases) {
        assert(bases instanceof Array);
        for ( let i = 0 ; i < bases.length ; i++ ) {
            if (this.contracts.has(bases[i].name)) {
                for ( j in this.contracts.get(bases[i].name).bases) {
                    let baseBase = this.contracts.get(bases[i].name).bases[j];
                    for ( let k = i+1 ; k < bases.length ; k++ ) {
                        if (baseBase === bases[k].name) {
                            console.log("Linearization of inheritance graph impossible");
                            return false;
                        }
                    }
                }
            }
            else if (!this.interfaces.has(base.name)) {
                console.log("unknown base- " + bases[i].type + " start-" + bases[i].start );
                return false;
            }
        }
        return true;
    },

    addContract: function(node) {
        this.contracts.set(node.name, {});
        this.contracts.get(node.name).bases = [];
        for ( let i = 0 ; i < node.is.length ; i++ ) {
            this.contracts.get(node.name).bases.push(node.is[i].name);
        }
    },

    addInterface: function(node) {
        this.interfaces.set(node.name, {});
    },

    addLibrary: function(node) {
        this.libraries.set(node.name, {});
    }
};