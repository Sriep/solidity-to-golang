'use strict';
const assert = require("assert");
const gf = require("./gf.js");

module.exports = {

    code: function (node, history, parent, localHistory) {
        assert(node.type === "ReturnStatement");

        let goCode = "\t";
        goCode += "return ";
        if (node.argument && node.argument.expressions) {
            goCode += gf.codeSequence(node.argument.expressions, history, parent, localHistory);
        }
        return goCode;
    }

}