'use strict';
const assert = require("assert");
const gc = require("./gc.js");

module.exports = {

    code: function( node, history, blockHistory) {
        assert(node && node instanceof Array);
        let goCode = "";
        for ( let statement of node ) {
            switch (statement.type) {
                case "VariableDeclaration":
                    break;
                case "VariableDeclarationTuple":
                    break;
                case "EmptyStatement":
                    break;
                case "PlaceholderStatement":
                    break;
                case "ExpressionStatement":
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
                    break;
                case "ThrowStatement":
                    break;
                case "UsingStatement":
                    break;
                default:
                    throw( new Error("Unrecognised statement type" + statemet.type));
            }
        }

        return goCode;
    }



};