

function StatementHistory(depth) {
    this.depth = depth ? depth : 1;
    this.prevProperties = [];
    this.previousStatments = [];
    this.nestedIds = [];
    this.nestedMembers = [];
}

module.exports = StatementHistory;