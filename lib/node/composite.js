var BTNode = require('./node');
var util = require('util');

/**
 * Composite node: parent of nodes that have multi-children. 
 * 复合节点:具有多个子节点的节点的复合节点，只是节点集合，没有doAction，用于加入多个子节点
 */
var Node = function(blackboard) {
  BTNode.call(this, blackboard);
  //其实this.blackboard = blackboard这句多余，继承了node节点就已经有这个属性
  this.blackboard = blackboard;
  this.children = [];
};
util.inherits(Node, BTNode);

module.exports = Node;

var pro = Node.prototype;

/**
 * Add a child to the node
 * 增加子节点
 */
pro.addChild = function(node) {
  this.children.push(node);
};
