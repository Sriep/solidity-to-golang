'use strict';
const assert = require("assert");
const gc = require("./gc.js");

module.exports = {

    code: function(node, history, parent) {
        assert(node && node.type === "EnumDeclaration");

        let goCode = "";
        goCode += "type " + node.name;
        goCode += gc.suffixContract ? "_" + parent : "";
        goCode += " int";
        for ( let i=0 ; i<node.members.length; i++ ) {
            history.sourceUnits.get(parent).constants.set(node.members[i], i);
        }
        return goCode + "\n";
    }

};