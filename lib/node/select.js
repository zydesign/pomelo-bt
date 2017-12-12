var bt = require('../bt');
var util = require('util');
var Composite = require('./composite');

/**
 * Select node: a parent node that would invoke children one by one.
 * Return success and reset state if one child return success.
 * Return fail if all children fail.
 * Return wait and hold state if one child return wait.
 * 选择节点：该节点的doAction，从头开始执行子节点的doAction，如果有一个子节点返回ture，则重置标签，退出遍历，并返回ture
 * 如果子节点返回false，则继续遍历下一个，如果全部都是false，则重置标签，返回false
 *
 * 【结果是否ture，只要有一个子节点成立即可】
 */
var Node = function(opts) {
  /先用复合节点储存子节点数组
  Composite.call(this, opts.blackboard);
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
  //每遍历一个元素，index加1，记录遍历到哪里，如果返回等待，下次执行这个选择节点时，从index位置开始遍历
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
