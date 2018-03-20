

function StatementHistory(depth) {
    this.depth = depth ? depth : 1;
    this.prevArrayProperties = "";
}

module.exports = StatementHistory;