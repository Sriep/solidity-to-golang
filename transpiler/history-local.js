const assert = require("assert");
const dic = require("./soltogo-dictionary");

module.exports = {

    identifiers: new Map(),

    addVariable: function(identifier, type, storageType) {
        if (this.identifiers.has(identifier)) {
            throw(new Error("identifier " + identifier + " repeat declaration"))
        } else {
            this.identifiers.set(identifier, {type, storageType});
        }
    }

};
