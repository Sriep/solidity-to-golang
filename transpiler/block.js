'use strict';
const assert = require("assert");
const expression = require("./statement-expression");
const varDeclaration = require("./statement-var-declare");
const returnStatement = require("./statement-return");
const gc = require("./gc.js");

module.exports = {

    code: function( node, history, localHistory, parent) {
        assert(node && node instanceof Array);
        let goCode = "";
        for ( let statement of node ) {
            switch (statement.type) {
                case "VariableDeclaration":
                    goCode += varDeclaration.code(statement, history, localHistory, parent);
                    break;
                case "VariableDeclarationTuple":
                    //goCode += varDeclaration.codeTuple(statement, history, localHistory, parent);
                    break; // Bug in grammar
                case "EmptyStatement":
                    break;
                case "PlaceholderStatement":
                    break;
                case "ExpressionStatement":
                    goCode += expression.code(statement, history, localHistory, parent);
                    break;
                case "IfStatement":
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
                    goCode += returnStatement.code(statement, history, localHistory, parent);
                    break;
                case "ThrowStatement":
                    break;
                case "UsingStatement":
                    break;
                default:
                    throw( new Error("Unrecognised statement type" + statemet.type));
            }
            goCode += "\n";
        }

        return goCode;
    }



};