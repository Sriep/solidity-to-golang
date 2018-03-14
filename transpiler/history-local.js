const assert = require("assert");
const dic = require("./soltogo-dictionary");
const gf = require("./gf.js");

module.exports = {

    memoryVariables: new Map(),
    stateVariables: new Map(),
    constants: new Map(),

    addVariable: function(node, history, parent) {
        return this.addVariableName(node, node.name, node.visibility, node.Type, parent)
    },

    addVariableName: function(node, id, visibility, nodeType, parent) {
        if (this.memoryVariables.has(id) || this.stateVariables.has(id) || this.constants.has(id)) {
            throw(new Error("identifier " + id + " repeat declaration"))
        }
        let goId = gf.modifyId(id, visibility, nodeType, parent.name);

        if (nodeType === "StateVariableDeclaration") {
            if (node.is_constant) {
                this.constants.set(id, 0);
            } else {
                this.stateVariables.set(id, {node: node, goName: goId});
            }
        } else {
            if (node.is_constant) {
                this.constants.set(id, 0);
            } else {
                this.memoryVariables.set(id, {node: node, goName: goId});
            }
        }
    }


};
