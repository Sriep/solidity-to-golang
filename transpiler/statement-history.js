

function StatementHistory(depth) {
    this.depth = depth ? depth : 1;
    this.prevProperties = [];
    this.previousStatments = [];
}

module.exports = StatementHistory;