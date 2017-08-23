var bt = require('../bt');
var util = require('util');
var Composite = require('./composite');

/**
 * Select node: a parent node that would invoke children one by one.
 * Return success and reset state if one child return success.
 * Return fail if all children fail.
 * Return wait and hold state if one child return wait.
 * 选择节点：从头开始执行子节点的doAction，如果有一个子节点返回ture，则重置标签，退出遍历，并返回ture
 * 如果子节点返回false，则继续遍历下一个，如果全部都是false，则重置标签，返回false
 */
var Node = function(opts) {
  Composite.call(this, opts.blackboard);
  this.index = 0;
};
util.inherits(Node, Composite);

var pro = Node.prototype;

/**
 * Do the action
 */
pro.doAction = function() {
  if(!this.children.length) {
    //if no child
    return bt.RES_SUCCESS;
  }

  if(this.index >= this.children.length) {
    this.reset();
  }

  var res;
  for(var l=this.children.length; this.index<l; this.index++) {
    res = this.children[this.index].doAction();
    if(res === bt.RES_SUCCESS) {
      //reset and return if success
      this.reset();
      return res;
    } else if(res === bt.RES_WAIT) {
      //return to parent directly if wait
      return res;
    } else {
      //try next if fail
      continue;
    }
  }
  //we will return success if all children success
  this.reset();
  return bt.RES_FAIL;
};

/**
 * Reset the node state
 */
pro.reset = function() {
  this.index = 0;
};

module.exports = Node;
