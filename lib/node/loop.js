var bt = require('../bt');
var util = require('util');
var Decorator = require('./decorator');

    //循环节点是先判断子节点，再判断条件，如果任何环节返回结果是等待bt.RES_WAIT的，才是循环,下次updata继续执行，而不执行下一个节点


/**            
 * Loop node: a decorator node that invoke child in loop.
 * 循环节点：如果子节点为ture，而且循环条件为ture，则结果返回bt.RES_WAIT，下次继续执行
            如果子节点为ture，循环条件为false，即不必循环，结果返回ture

 *
 * @param opts {Object} 
 *        opts.blackboard {Object} blackboard object
 *        opts.child {Object} origin action that is decorated
 *        opts.loopCond(blackboard) {Function} loop condition callback. Return true to continue the loop.
 * @return {Number} 
 *          bt.RES_SUCCESS if loop finished successfully;
 *          bt.RES_FAIL and break loop if child return fail;
 *          bt.RES_WAIT if child return wait or loop is continue.
 */
var Node = function(opts) {
            //继承包装节点（有子节点）
  Decorator.call(this, opts.blackboard, opts.child);
  this.loopCond = opts.loopCond;
};

util.inherits(Node, Decorator);

module.exports = Node;

var pro = Node.prototype;


pro.doAction = function() {
  var res = this.child.doAction();
    //如果子节点结果是失败或等待，loop返回结果为失败或等待
  if(res !== bt.RES_SUCCESS) {
    return res;
  }
    //如果子节点结果成立，循环条件成立，返回等待，下一次循环继续；
    //如果子节点结果成立，循环条件不成立，返回成立，也就不循环
  if(this.loopCond && this.loopCond.call(null, this.blackboard)) {
    //wait next tick
    return bt.RES_WAIT;
  }

  return bt.RES_SUCCESS;
};
