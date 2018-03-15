'use strict';
const assert = require("assert");
const gc = require("./gc.js");
const gf = require("./gf.js");
const expression = require("./statement-expression.js");

module.exports = {

    codeWhile: function(node, history, parent, localHistory, depth, funcBlock) {
        assert(node && node.type === "WhileStatement");
        const block = require("./block.js");
        let goCode = "";
        goCode += "\t".repeat(depth) + "for ";
        goCode += expression.codeExpression(node.test, history, parent, localHistory, depth);
        goCode += block.codeStatement(node.body, history, parent, localHistory, depth+1);
        return goCode;
    },

    codeDoWhile: function (node, history, parent, localHistory, depth, funcBlock) {
        assert(node && node.type === "DoWhileStatement");
        const block = require("./block.js");
        let goCode = "";
        goCode += "\t".repeat(depth) + "for __ok := true; __ok; __ok = ";
        goCode += goCode += expression.codeExpression(node.test, history, parent, localHistory, depth);
        goCode += block.codeStatement(node.body, history, parent, localHistory, depth+1);
        return goCode;
    },

    codeFor: function(node, history, parent, localHistory, depth, funcBlock) {
        assert(node && node.type === "ForStatement");
        const block = require("./block.js");
        let goCode = "\t".repeat(depth);
        goCode += "for ";
        if (node.init)
            goCode += expression.codeExpression(node.init, history, parent, localHistory, depth);
        goCode += " ; ";
        if (node.test)
            goCode += expression.codeExpression(node.test, history, parent, localHistory, depth);
        goCode == " ; ";
        if (node.update)
            goCode += expression.codeExpression(node.update, history, parent, localHistory, depth);
        goCode += block.codeStatement(node.body, history, parent, localHistory, depth+1);
        return goCode;
    }

};