'use strict';
const assert = require("assert");


module.exports = {

    code: function(node, history, parent, localHistory) {
        assert(node.type == "VariableDeclaration");

        let goCode = "";

        assert(node.declarations.length() === 0);
        goCode += node.declarations[0].id.name;
        goCode += " := ";
        if (node.declarations[0].init.type === "Identifier")
            goCode += node.declarations[0].init.name;
        else if (node.declarations[0].init.type === "Literal")
            goCode += node.declarations[0].init.value;
        else
            assert(false);

        return goCode;
    },

    codeTuple: function(node, history, parent, localHistory) {
        assert(node.type == "VariableDeclarationTruple");
        assert(node.declarations instanceof Array);
        // todo not implemented. Seems to be bug in grammer. init is null.
    }


};