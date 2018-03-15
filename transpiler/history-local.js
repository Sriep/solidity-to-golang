const assert = require("assert");


module.exports = {

    variables: new Map(),
    constants: new Map(),

    addVariable: function(node, history, parent) {
        return this.addVariableName(node, node.name, node.Type, parent)
    },

    addVariableName: function(node, id, isMemory, dataType) {
        if (this.variables.has(id) || this.constants.has(id)) {
            throw(new Error("identifier " + id + " repeat declaration"))
        }

        if (node.is_constant) {
            this.constants.set(id, node.value);
        } else {
            this.variables.set(id, {
                node: node,
                goName: isMemory ? id : undefined,
                isMemory: isMemory,
                dataType: dataType
            });
        }

    }


};
