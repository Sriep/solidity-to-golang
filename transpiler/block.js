'use strict';
const assert = require("assert");
const expression = require("./statement-expression.js");
const varDeclaration = require("./statement-var-declare.js");
const returnStatement = require("./statement-return.js");
const iterationStatement = require("./statement-iteration.js");
const gc = require("./gc.js");
const gf = require("./gf.js");

module.exports = {

    codeFunctionBlock: function( node, history, parent, localHistory)
    {
        assert(node && node instanceof Array);
        let goCode;
        let funcBlock = { defs: "", code: ""};
        goCode = this.code(node, history, parent, localHistory, 0, funcBlock);

    },

    code: function( node, history, parent, localHistory, depth, funcBlock) {
        assert(node && node instanceof Array);

        let goCode = "";
        for ( let statement of node ) {
            goCode += this.codeStatement(statement, history, parent, localHistory, depth, funcBlock);
        }
        return goCode;
    },

    codeStatement: function(statement, history, parent, localHistory, depth, funcBlock) {
        assert(statement);

        let goCode ="";
        switch (statement.type) {
            case "BlockStatement":
                goCode += "{\n";
                goCode += this.code(statement.body, history, parent, localHistory, depth+1);
                goCode += "\n" +"\t".repeat(depth) + "}";
                break;
            case "VariableDeclaration":
                goCode += varDeclaration.code(statement, history, parent, localHistory, depth);
                break;
            case "VariableDeclarationTuple":
                //goCode += varDeclaration.codeTuple(statement, history, parent, localHistory);
                break; // todo Bug in grammar??????
            case "EmptyStatement":
                break;
            case "PlaceholderStatement":
                break;
            case "ExpressionStatement":
                goCode += expression.code(statement, history, parent, localHistory, depth);
                break;
            case "IfStatement":
                const ifStatement = require("./statement-if.js");
                goCode += ifStatement.code(statement, history, parent, localHistory, depth);
                break;
            case "DoWhileStatement":
                goCode += iterationStatement.codeDoWhile(statement, history, parent, localHistory, depth, funcBlock);
                break;
            case "WhileStatement":
                goCode += iterationStatement.codeWhile(statement, history, parent, localHistory, depth, funcBlock);
                break;
            case "ForStatement":
                goCode += iterationStatement.codeFor(statement, history, parent, localHistory, depth, funcBlock);
                break;
            case "InlineAssemblyStatement":
                break;
            case "ContinueStatement":
                goCode += "\t".repeat(depth) + "continue";
                break;
            case "BreakStatement":
                goCode += "\t".repeat(depth) + "break";
                break;
            case "ReturnStatement":
                goCode += returnStatement.code(statement, history, parent, localHistory, depth);
                break;
            case "ThrowStatement":
                goCode += "\t".repeat(depth) + "panic(\"\")";
                break;
            case "UsingStatement":
                break;
            default:
                throw( new Error("Unrecognised statement type" + statemet.type));
        }
        goCode += "\n";
        return goCode;
    }



};