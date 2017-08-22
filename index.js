var bt = require('./lib/bt');
var exp = module.exports;

//成功完成的行为
exp.RES_SUCCESS = bt.RES_SUCCESS;
//失败的行为
exp.RES_FAIL 	= bt.RES_FAIL;
//行为正在运行
exp.RES_WAIT 	= bt.RES_WAIT;


//根节点
exp.Node 		= require('./lib/node/node');
//复合节点
exp.Composite 	= require('./lib/node/composite');
//条件节点
exp.Condition 	= require('./lib/node/condition');
//装饰节点
exp.Decorator 	= require('./lib/node/decorator');
//队列
exp.Sequence 	= require('./lib/node/sequence');
//并行
exp.Parallel 	= require('./lib/node/parallel');
//选择器
exp.Select 		= require('./lib/node/select');
//循环
exp.Loop 		= require('./lib/node/loop');
//条件
exp.If 			= require('./lib/node/if');
