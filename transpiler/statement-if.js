'use strict';
const assert = require("assert");
const expression = require("./statement-expression");

module.exports = {

    code: function (node, history, parent, localHistory, statHistory, declarations) {
        const block = require("./block.js");
        assert(node.type === "IfStatement");

        let goCode = "\t".repeat(statHistory.depth) + "if ";
        goCode += expression.codeExpression(node.test, history, parent, localHistory);
        goCode += block.codeStatement(node.consequent, history, parent, localHistory, statHistory+1, declarations);
        if (node.alternate) {
            if (goCode[goCode.length -1] === "\n")
                goCode = goCode.slice(0, -1);
            goCode += " else ";
            goCode += block.codeStatement(node.alternate, history, parent, localHistory, statHistory+1, declarations);
        }
        return goCode;
    }
};

