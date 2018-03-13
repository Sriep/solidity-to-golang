'use strict';
const assert = require("assert");
const expression = require("./statement-expression.js");
const varDeclaration = require("./statement-var-declare.js");
const returnStatement = require("./statement-return.js");
const gc = require("./gc.js");
const gf = require("./gf.js");

module.exports = {

    code: function( node, history, localHistory, parent, depth) {
        assert(node && node instanceof Array);

        let goCode = "";
        for ( let statement of node ) {
            goCode += this.codeStatement(statement, history, localHistory, parent, depth);
        }
        return goCode;
    },

    codeStatement: function(statement, history, localHistory, parent, depth) {
        assert(statement);

        let goCode ="";
        switch (statement.type) {
            case "BlockStatement":
                goCode += "{\n";
                goCode += this.code(statement.body, history, localHistory, parent, depth+1);
                goCode += "\n" +"\t".repeat(depth) + "}";
                break;
            case "VariableDeclaration":
                goCode += varDeclaration.code(statement, history, localHistory, parent, depth);
                break;
            case "VariableDeclarationTuple":
                //goCode += varDeclaration.codeTuple(statement, history, localHistory, parent);
                break; // Bug in grammar
            case "EmptyStatement":
                break;
            case "PlaceholderStatement":
                break;
            case "ExpressionStatement":
                goCode += expression.code(statement, history, localHistory, parent, depth);
                break;
            case "IfStatement":
                const ifStatement = require("./statement-if.js");
                goCode += ifStatement.code(statement, history, localHistory, parent, depth);
                break;
            case "DoWhileStatement":
                break;
            case "WhileStatement":
                break;
            case "ForStatement":
                break;
            case "InlineAssemblyStatement":
                break;
            case "ContinueStatement":
                break;
            case "BreakStatement":
                break;
            case "ReturnStatement":
                goCode += returnStatement.code(statement, history, localHistory, parent, depth);
                break;
            case "ThrowStatement":
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