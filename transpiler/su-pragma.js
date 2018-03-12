'use strict';
const assert = require("assert");

module.exports = {
    codePragma: function(node, history) {
        assert(node);
        assert(!(node instanceof Array));
        console.log("node-" + node.type + ' start-' + node.start + ' end-' + node.end);
        if (node.start_version
            && node.start_version.operator === "^"
            && node.start_version.type === "VersionLiteral")
        {
            history.startVersion = node.start_version.version;
            console.log("Set start verion to" + history.startVersion);
        }
        if (node.end_version
            && node.end_version.operator === "^"
            && node.end_version.type === "VersionLiteral")
        {
            history.endVersion = node.end_version.version;
            console.log("Set end verion to" + history.endVersion);
        }
        return "";
    }

};