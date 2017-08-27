操作步骤:
	1.在github或码云上新建仓库
	2.将仓库地址clone到本地

后端:
	1. 全局安装express脚手架和express-generator项目生成器
		npm i express -g
		npm i express-generator -g
	2. 创建项目: express -e 后台项目名称 => cd 项目目录 => npm i
	3. 启动mongodb数据库: cmd: mongod.exe
	4. 运行node ./bin/www 测试nodejs环境是否正常
	5. 安装模块cors(解决跨域),并且在app.js中引入和配置cors模块 => npm i cors -D
	6. 安装mongoose => mongoose是配置mongodb和nodejs的一个数据管理模块(对数据进行限定和安全性考虑)
	7. 安装异步操作模块async(串行无关联,并行无关联,串行有关联) => 
	8. 在app.js中引入并配置mongoose(引入,设置链接地址,进行链接操作)
	9. 在github上搜索并安装mongoose-materialized => npm i mongoose-materialized -D
	10. 在项目目录下新建controllers和models目录
	11. 在models目录下新建xxx.model.js文件,将materialized中Usage下的内容拷贝进来
	12. 通过xxx.model.js可以创建并配置mongodb的集合内容,可以进行字段内容的限定
	13. xxx.model.js是一个数据集合配置信息模块,就相当于mysql里进行了一个表的设计
	14. 在controllers目录下新建xxx.controller.js文件,将xxx.model.js引入,对该对象进行实例化,然后进行增删改查等操作
	15. 在routes目录下新建一个xxx.js子路由,引入controller.js,定义restful api接口内容
	16. 修改app.js,将xxx模块引入,并进行路由配置

	总结: 
		1.连接数据库(用mongoose来取代mongodb进行处理)
		2.model是对数据库的集合进行设计(限定添加进来的字段)
		3.使用mongoose-materialized插件来进行增删改查
		4.配置子路由(restful api形式的路由)

前端:
	1. vue init webpack-simple 项目名称
	2. 安装(axios,vue-axios), vue-router,iview
	3. 修改main.js, 将iview/vue-router/axios/vue-axios引入进来,并且进行use使用
	4. 因为钱的的UI框架使用的是iview,所有直接在app.vue里应用layout,table(仅仅是实现了数据的列表操作),
	   Pagination(分页组件,仅仅实现了分页操作,并没有实现每页显示多少条的切换操作)
	5. 在根目录下新建routes目录以及routes路由配置文件,将路由引入main.js中,在app.vue中设置router-view
	6. 建立了home.vue和user.vue组件,通过路由来实现对这些组件的切换以及显示

	需要改善加强的地方:
		1.列表里,每页搜索功能
		2.列表里,每页全选,反选或者多选功能
		3.分页里,每页显示多少条切换以后没有改变
		4.用户信息的密码字段需要进行加密存储(github上搜索crypto-js)
		5.App.vue要进行分离操作
		6.目录结构混乱,代码不清晰,数据定义混乱(新建立了view,将视图层内容从components脱离出来)
		
		parentId _id 如果我们修改的是根节点,那么parentId应该是null
		如果我们修改的是子节点,parentId又要进行设置
		因为selectChange的时候,我们设置了一个parentId,所有我们重新加入一个currentParentId,也就是当前选中节点对象的parendId

		分类的操作:
			tree组件
				1.添加节点(添加根节点 => parendId:null, 添加对应节点的子节点 => parentId:不为空,
					type分类: 1,2,3,..需要确定分类的类型)
					type是三个button, :class动态绑定样式,通过判断来实现的,主要是通过object对象的设置,
					type操作在submit的时候可以通过先设置一个type,然后Object.assign()之后,在对this.xxx.type进行type的重新赋值
				2.修改操作: 需要一个_id, 因为之前的添加节点操作,所有需要另外有一个currentParentId进行中间转化操作
				3.删除操作: 删除操作的主要难点是在nodejs服务端,前端只需要delete相应的_id对象就行了。
							nodejs服务端,需要通过getChildren获取到平行对象内容,然后就可以通过for循环,直接将ids计算出来,
							通过$in进行in的删除
				4.分类处理完了以后,我们提取了user模块的核心代码,并且将它们放置到了base.js里,作为公共mixins的核心层,需要注意一个主参数叫modules模块
				5.新建一个模块,如果功能类似于user模块的内容,那么可以直接利用mixins简化大量相同功能的代码,
				比如新闻模块,产品模块,订单模块等都有添加,修改,删除,多个删除,搜索,切换分页,切换每页显示的数量等
				6.新闻模块需要和分类模块进行结合操作,因为所有的新闻都是归属于某些分类的,
				所以这个模块就可以利用mixins进行快速的集成了 
				7.vue-quill-editor富文本编辑器插件
