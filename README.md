#pomelo-bt - behavior tree for node.js

pomelo-bt is a Behavior-Tree module for pomelo project to implement AI. More information about Behavior-Tree please refer other articles from Internet, such as [Understanding Behavior Trees](http://aigamedev.com/open/article/bt-overview/).
pomelo - bt是pomelo项目实施人工智能的行为树模块。关于行为树的更多信息请参考互联网上的其他文章，比如[理解行为树]。

+ Tags: node.js

##Installation 安装
```
npm install pomelo-bt
```

##Behavior tree nodes 行为树节点

###Node  节点
The base class of all the behavior tree node classes. Its constructor receives a blackboard instance as parameter.
node（blackboard）
所有行为树节点类的基类。它的构造函数参数为blackboard。

Each node class provides a `doAction` method to fire the behavior of current node instance. All the children should implement their own `doAction`. And the `doAction` method sould report a result code to the parent when it return. The result code is one of below:
每个节点类都提供了一个“doAction”方法来触发当前节点实例的行为。所有的孩子都应该实施自己的“doAction”。而“doAction”方法在返回时将  结果代码  报告给父进程。结果代码如下:
（return bt.RES_SUCCESS） 成功完成的行为
（return bt.RES_FAIL）    失败的行为
（return bt.RES_WAIT）    行为正在运行

+ RES_SUCCESS: the behavior finished successfully. 
            成功完成的行为。
+ RES_FAIL: the behavior fails.  
            失败的行为。
+ RES_WAIT: the behavior is running and should be continued in next tick. 
            行为正在运行，应该在下一个滴答中继续。
The parent node makes its decision based on the result code.
            父节点根据结果代码做出决定。

###Composite 复合
The base class of all the composite nodes. A composite node has arbitrary child nodes and it has a `addChild` method to add child node.
  所有复合节点的基类。复合节点具有任意子节点，它有一个“addChild”方法来添加子节点。

###Decorator 装饰者
The base class of all the decorator nodes. A decorator node has the ability to decorate the result for its child node. A decorator node has only one child node and has a `setChild` method to set the child node.
所有装饰器节点的基类。装饰节点有能力将其子节点的结果进行装饰。装饰节点只有一个子节点，并有一个“setChild”方法来设置子节点。

Followings are some behavior node types provided in `pomelo-bt`.
以下是“pomelo - bt”中提供的一些行为节点类型。

##Composite nodes  复合节点
###Sequence        复合序列函数---行为一个接一个执行
Implementation of `sequence` semantics. “序列”语义的实现。
####Sequence(opts)
+ opts.blackboard - blackboard instance for the behavior node.行为节点的blackboard实例。

###Parallel  并行---行为是同时执行
Implementation of parallel semantics. 实现并行的语义。
####Parallel(opts)
+ opts.blackboard   （配置的黑板）- blackboard instance for the behavior node.
+ opts.policy        (配置的策略) - Failure strategy for Parallel node: `Parallel.POLICY_FAIL_ON_ONE`(default) return `RES_FAIL` if one child node fail, `Parallel.POLICY_FAIL_ON_ALL` return `RES_FAIL` only on all the child nodes fail.
  并行节点的失败策略:“Parallel . policy_fail_on_one”(默认)如果一个子节点失败，则返回“RES_FAIL”。POLICY_FAIL_ON_ALL ' return ' RES_FAIL '只在所有子节点上失败。

###Selector   选择器
Implementation of selector semantics.
####Selector(opts)
+ opts.blackboard - blackboard instance for the behavior node.

###Decorator nodes   装饰节点
###Loop  循环
Implementation of loop semantics.
####Loop(opts)
+ opts.blackboard - blackboard instance for the behavior node.
+ opts.child   （配置的子节点）- child node for the decorator node。装饰节点的子节点
+ opts.loopCond(blackboard)   （配置的循环条件） - loop condition function. return true to continue the loop and false to break the loop.
          循环条件的函数。返回true以继续循环，false来打破循环。

###Condition  条件
Return `RES_SUCESS` if the condition is true otherwise return `RES_FAIL`.
如果条件为真，返回' RES_SUCESS '，如果条件为假，则返回' RES_FAIL '。

####Condition(opts)
+ opts.blackboard - blackboard instance for the behavior node.
+ opts.cond(blackboard) （配置的条件）- condition function, return true or false.

##Other nodes 其他节点
###If  如果
Implementation of loop semantics. If the condition is true, then fire the child node.
   循环的实现语义。如果条件为真，则启动子节点。
####If(opts)
+ opts.blackboard - blackboard instance for the behavior node.
+ opts.action - child node.
+ opts.cond(blackboard) （配置的条件）- condition function, return true or false.

##Usage 使用方法
``` javascript
var util = require('util');
var bt = require('pomelo-bt');
var Sequence = bt.Sequence;
var Node = bt.Node;

// define some action nodes  定义一些行为节点

//定义HelloNode行为节点，继承node
var HelloNode = function(blackboard) {
  Node.call(this, blackboard);
};
//让HelloNode继承node节点
util.inherits(HelloNode, Node);

//HelloNode的doAction方法
HelloNode.prototype.doAction = function() {
  console.log('Hello ');
  return bt.RES_SUCCESS;
};

//定义WorldNode行为节点，继承node
var WorldNode = function(blackboard) {
  Node.call(this, blackboard);
};
util.inherits(WorldNode, Node);

//WorldNode的doAction方法
WorldNode.prototype.doAction = function() {
  console.log('World');
  return bt.RES_SUCCESS;
};

//黑板
var blackboard = {};

// composite your behavior tree 创建一个复合队列
var seq = new Sequence({blackboard: blackboard});
var hello = new HelloNode(blackboard);
var world = new WorldNode(blackboard);

seq.addChild(hello);
seq.addChild(world);

// run the behavior tree
seq.doAction();
```
