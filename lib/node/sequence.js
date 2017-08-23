var bt = require('../bt');
var util = require('util');
var Composite = require('./composite');

/**
 * Sequence node: a parent node that would invoke children one by one.
 * Return success if only if all the children return true.
 * It would break the iteration and reset states if any child fail.
 * It would return the wait state directly to parent and keep all the states if a child return wait
 * 序列节点：该节点的doAction是一个接一个执行子节点doAction。如果所有子节点返回ture，则重置标签并返回ture；
 * 如果有一个子节点返回false，则重置且返回false
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
      continue;
    } else if(res === bt.RES_WAIT) {
      //return to parent directly if wait
      //如果为等待中，则下次继续从该index位置开始遍历
      return res;
    } else {
      //reset state and return fail
      this.reset();
      return res;
    }
  }
  //we will return success if all children success
  this.reset();
  return bt.RES_SUCCESS;
};

/**
 * Reset the node state
 */
pro.reset = function() {
  this.index = 0;
};

module.exports = Node;
