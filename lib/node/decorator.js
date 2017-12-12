var BTNode = require('./node');
var util = require('util');

//该节点属性：黑板、一个孩子节点

/**
 * Decorator node: parent of nodes that decorate other node. 
 * 包装节点，没doAction，但子节点有doAction
 * 作用是建立父子节点关系
 */
var Node = function(blackboard, child) {
  BTNode.call(this, blackboard);
  this.child = child;
};
util.inherits(Node, BTNode);

module.exports = Node;

var pro = Node.prototype;

/**
 * set the child fo the node
 */
pro.setChild = function(node) {
  this.child = node;
};
