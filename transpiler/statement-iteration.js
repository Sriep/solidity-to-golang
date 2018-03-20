'use strict';
const assert = require("assert");

const expression = require("./statement-expression.js");

module.exports = {

    codeWhile: function(node, history, parent, localHistory, statHistory, declarations) {
        assert(node && node.type === "WhileStatement");
        const block = require("./block.js");
        let goCode = "";
        goCode += "\t".repeat(statHistory.depth) + "for ";
        goCode += expression.codeExpression(node.test, history, parent, localHistory, statHistory, declarations);
        goCode += block.codeStatement(node.body, history, parent, localHistory, statHistory+1, declarations);
        return goCode;
    },

    codeDoWhile: function (node, history, parent, localHistory, statHistory, declarations) {
        assert(node && node.type === "DoWhileStatement");
        const block = require("./block.js");
        let goCode = "";
        goCode += "\t".repeat(statHistory.depth) + "for __ok := true; __ok; __ok = ";
        goCode += expression.codeExpression(node.test, history, parent, localHistory, statHistory, declarations);
        goCode += block.codeStatement(node.body, history, parent, localHistory, statHistory+1, declarations);
        return goCode;
    },

    codeFor: function(node, history, parent, localHistory, statHistory, declarations) {
        assert(node && node.type === "ForStatement");
        const block = require("./block.js");
        let goCode = "\t".repeat(statHistory.depth);
        goCode += "for ";
        if (node.init)
            goCode += expression.codeExpression(node.init, history, parent, localHistory, statHistory, declarations);
        goCode += " ; ";
        if (node.test)
            goCode += expression.codeExpression(node.test, history, parent, localHistory, statHistory, declarations);
        goCode += " ; ";
        if (node.update)
            goCode += expression.codeExpression(node.update, history, parent, localHistory, statHistory, declarations);
        goCode += block.codeStatement(node.body, history, parent, localHistory, statHistory+1, declarations);
        return goCode;
    }

};