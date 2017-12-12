var bt = require('../bt');
var util = require('util');
var Composite = require('./composite');

/**
 * Parallel node: a parent node that would invoke children in parallel.
 * The node would wait for all the children finished and return the result.
 * The result value would be decided by the policy.
 * POLICY_FAIL_ON_ONE stands for return fail if any fails; 至少有一个失败
 * POLICY_FAIL_ON_ALL stands for return fail if and only if all fail.  全部失败，即至少有一个成功
 * 并行节点：该节点的doAction，同时执行子节点的doAction。并记录结果。最后结果将由通过参数的策略决定。
 *
 *【结果是否ture，取决于参数的policy（策略）条件】
 */
var Node = function(opts) {
  Composite.call(this, opts.blackboard);
  //配置一个检查策略
  this.policy = opts.policy||Node.POLICY_FAIL_ON_ONE;
  this.waits = [];
  this.succ = 0;
  this.fail = 0;
};
util.inherits(Node, Composite);

module.exports = Node;

var pro = Node.prototype;

Node.POLICY_FAIL_ON_ONE = 0;
Node.POLICY_FAIL_ON_ALL = 1;

/**
 * do the action
 */
pro.doAction = function() {
  //如果没有子节点，返回成功
  if(!this.children.length) {
    //if no child
    return bt.RES_SUCCESS;
  }

  var res;
  var rest = [];
  //如果等待数组存在（上次执行策略节点留下的），则遍历对象为该等待数组
  var origin = this.waits.length ? this.waits : this.children;

  //iterate all the children and record the results
  //遍历所有子节点并记录结果
  for(var i=0, l=origin.length; i<l; i++) {
    res = origin[i].doAction();
    switch(res) {
      case bt.RES_SUCCESS:
        this.succ++;
        break;
      case bt.RES_WAIT:
        rest.push(origin[i]);
        break;
      default:
        this.fail++;
        break;
    }
  }

  //如果有等待节点，返回等待，下次执行
  if(rest.length) {
    //return wait if any in wait
    this.waits = rest;
    return bt.RES_WAIT;
  }

  //check the result if all have finished
  //如果没有等待节点了，全部执行完成了，也就是没有bt.RES_WAIT，则重置标签，并检查结果
  res = this.checkPolicy();
  this.reset();
  return res;
};

/**
 * reset the node state
 */
pro.reset = function() {
  this.waits.length = 0;
  this.succ = 0;
  this.fail = 0;
};

/**
 * check current state with policy
 *
 * @return {Number} ai.RES_SUCCESS for success and ai.RES_FAIL for fail
 */
//根据参数决定判断条件
pro.checkPolicy = function() {
  //有一个失败，返回失败。等同顺序节点sequence
  if(this.policy === Node.POLICY_FAIL_ON_ONE) {
    return this.fail ? bt.RES_FAIL : bt.RES_SUCCESS;
  }

  //有一个成功，返回成功。等同选择节点select
  if(this.policy === Node.POLICY_FAIL_ON_ALL) {
    return this.succ ? bt.RES_SUCCESS : bt.RES_FAIL;
  }
};
