var BTNode = require('./node');
var util = require('util');

/**
 * Parent of all behavior tree nodes.
 * 行为树的根节点，无doAction，只有一个blackboard属性
 */
var Node = function(blackboard) {
  this.blackboard = blackboard;
};

module.exports = Node;
