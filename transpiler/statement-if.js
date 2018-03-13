'use strict';
const assert = require("assert");
const gf = require("./gf.js");
const expression = require("./statement-expression");

module.exports = {

    code: function (node, history, localHistory, parent, depth) {
        const block = require("./block.js");
        assert(node.type === "IfStatement");

        let goCode = "\t".repeat(depth) + "if ";
        goCode += expression.codeExpression(node.test, history, localHistory, parent);
        goCode += block.codeStatement(node.consequent, history, localHistory, parent, depth+1);
        if (node.alternate) {
            if (goCode[goCode.length -1] == "\n")
                goCode = goCode.slice(0, -1);
            goCode += " else ";
            goCode += block.codeStatement(node.alternate, history, localHistory, parent, depth+1);
        }
        return goCode;
    }
};

