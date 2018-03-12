'use strict';
const assert = require("assert");
const gf = require("./gf.js");

module.exports = {

    code: function (node, history, localHistory, parent) {
        assert(node.type == "ReturnStatement");

        let goCode = "\t";
        goCode += "return ";
        if (node.argument && node.argument.expressions) {
            goCode += gf.codeSequence(node.argument.expressions);
        }
        return goCode;
    }

}