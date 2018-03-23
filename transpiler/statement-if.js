'use strict';
const assert = require("assert");
const expression = require("./statement-expression");

module.exports = {

    code: function (node, history, parent, localHistory, statHistory, declarations, chained) {
        const block = require("./block.js");
        assert(node.type === "IfStatement");

        let goCode = "";
        if (!chained)
            goCode += "\t".repeat(statHistory.depth) + "if ";
        goCode += expression.codeExpression(node.test, history, parent, localHistory, statHistory);
        if (node.consequent.type === "BlockStatement") {
            goCode += block.codeStatement(node.consequent, history, parent, localHistory, statHistory, declarations);
        } else {
            goCode += " {\n";
            statHistory.depth++;
            goCode += block.codeStatement(node.consequent, history, parent, localHistory, statHistory, declarations);
            statHistory.depth--;
            goCode += "\n" +"\t".repeat(statHistory.depth) + "}";
        }
        if (node.alternate) {
            if (goCode[goCode.length -1] === "\n")
                goCode = goCode.slice(0, -1);
            goCode += " else ";
            if (node.alternate.type === "BlockStatement") {
                goCode += block.codeStatement(node.alternate, history, parent, localHistory, statHistory, declarations);
            } else if (node.alternate.type === "IfStatement") {
                goCode += block.codeStatement(node.alternate, history, parent, localHistory, statHistory, declarations, true);
            } else {
                goCode += "{\n";
                statHistory.depth++;
                goCode += block.codeStatement(node.alternate, history, parent, localHistory, statHistory, declarations);
                statHistory.depth--;
                goCode += "\n" +"\t".repeat(statHistory.depth) + "}";
            }
        }
        return goCode;
    }
};

