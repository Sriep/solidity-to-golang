'use strict';
const assert = require("assert");
const expression = require("./statement-expression.js");

module.exports = {

    code: function (node, history, parent, localHistory, statHistory) {
        assert(node.type === "ReturnStatement");

        let goCode = "\t";
        goCode += "return ";
        if (node.argument) {
            goCode += expression.codeExpression(node.argument, history, parent, localHistory, statHistory);
        }
        return goCode;
    },

};