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
 *
 * 【结果是否ture，只有全部子节点成立，才算成立】
 */
var Node = function(opts) {
  //先用复合节点储存子节点数组
  Composite.call(this, opts.blackboard);
  //记录从第几个开始遍历
  this.index = 0;
};
util.inherits(Node, Composite);

var pro = Node.prototype;

/**
 * Do the action
 */
pro.doAction = function() {
  //如果没有子节点，返回成功
  if(!this.children.length) {
    //if no child
    return bt.RES_SUCCESS;
  }
//如果标签读到最后一个，则重置标签
  if(this.index >= this.children.length) {
    this.reset();
  }

  var res;
  //每遍历一个元素，index加1
  for(var l=this.children.length; this.index<l; this.index++) {
    res = this.children[this.index].doAction();
    //continue作用，如果条件成立遍历下一个
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
