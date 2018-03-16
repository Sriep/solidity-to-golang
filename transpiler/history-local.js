const assert = require("assert");


module.exports = {

    variables: new Map(),
    constants: new Map(),

    setNewAlias: function(variable, newValue) {
        if (!this.variables.has(variable)) {
            assert(false, "setting value to unknown alias")
        } else  if (this.variables.get(variable).isMemory) {
            assert(false, "treating memory variable as alias")
        } else {
            this.variables.get(variable).goName = newValue;
        }
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
