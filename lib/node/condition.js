var bt = require('../bt');
var util = require('util');
var BTNode = require('./node');

/**
 * Condition node. 条件节点
 * 该节点的doAction，先判断参数的条件是否成立，来返回结果
 * 作用：处理参数的条件
 *
 * @param opts {Object} 
 *        opts.blackboard {Object} blackboard object
 *        opts.cond(blackboard) {Function} condition callback. Return true or false to decide the node return success or fail.
 * @return {Number} 
 *          bt.RES_SUCCESS if cond callback return true;
 *          bt.RES_FAIL if cond undefined or return false.
 */
var Node = function(opts) {
  BTNode.call(this, opts.blackboard);
  this.cond = opts.cond;
};
util.inherits(Node, BTNode);

module.exports = Node;

var pro = Node.prototype;

pro.doAction = function() {
  //js语法：add.call(sub,a,b)；意思是用add来替换sub，参数为（a，b）
    //参数的cond存在，而且黑板存在，条件才成立
  if(this.cond && this.cond.call(null, this.blackboard)) {
    return bt.RES_SUCCESS;
  }

  return bt.RES_FAIL;
};
