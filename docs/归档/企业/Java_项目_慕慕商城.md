# 慕慕生鲜 springboot vue 商城项目

backend: http://localhost:8083

api: http://localhost:8083/swagger-ui.html

## 第五章 商品分类模块开发

### 问题: 为什么 新建一个 AddCategoryRequest 类, 而不是复用之前的 Category pojo类 ?

回答: 每个类都有自己单一的职责 不应该有多个职责 否则容易造成混乱. 

pojo的全称: plain ordinary java object 普通java对象 是表结构的映射

如果用其作为请求类 会产生多余字段 不够安全. 

![img.png](img.png)

@RequestParam("value") get query 参数 

@PathVariable("value") 路径变量 对应 getMapping(/{value})

@RequestBody post body 参数

参数校验: 

    @Valid: 开启入参校验

    具体入参, 在实体类中校验: @NotNull @Max @Size(Max, Min)

标题: 解决Spring Boot异常返回页面中文乱码问题 - 猪脚踏浪 - 博客园 网址: https://www.cnblogs.com/zsg88/articles/15934181.html

### 解决filter中文乱码: 

解决中文乱码 application.yml中: spring.http.encoding.force=true

// pojo abbr. 简单的 Java 对象（Plain Ordinary Java Object）

标题: 一篇文章讲清楚VO，BO，PO，DO，DTO的区别 - 知乎 网址: https://zhuanlan.zhihu.com/p/102389552

标题: 阿里巴巴Java开发手册中的DO、DTO、BO、AO、VO、POJO定义 - EasonJim - 博客园 网址: https://www.cnblogs.com/EasonJim/p/7967999.html

PO(persistant object) 持久对象
在o/r映射的时候出现的概念，如果没有o/r映射，没有这个概念存在了。通常对应数据模型(数据库),本身还有部分业务逻辑的处理。可以看成是与数据库中的表相映射的java对象。最简单的PO就是对应数据库中某个表中的一条记录，多个记录可以用PO的集合。PO中应该不包含任何对数据库的操作。

VO(value object) 值对象
通常用于业务层之间的数据传递，和PO一样也是仅仅包含数据而已。但应是抽象出的业务对象,可以和表对应,也可以不,这根据业务的需要.个人觉得同DTO(数据传输对象),在web上传递。

TO(Transfer Object)，数据传输对象
在应用程序不同tie(关系)之间传输的对象

BO(business object) 业务对象
从业务模型的角度看,见UML元件领域模型中的领域对象。封装业务逻辑的java对象,通过调用DAO方法,结合PO,VO进行业务操作。

POJO(plain ordinary java object) 简单无规则java对象
纯的传统意义的java对象。就是说在一些Object/Relation Mapping工具中，能够做到维护数据库表记录的persisent object完全是一个符合Java Bean规范的纯Java对象，没有增加别的属性和方法。我的理解就是最基本的Java Bean，只有属性字段及setter和getter方法！。

DAO(data access object) 数据访问对象
是一个sun的一个标准j2ee设计模式，这个模式中有个接口就是DAO，它负持久层的操作。为业务层提供接口。此对象用于访问数据库。通常和PO结合使用，DAO中包含了各种数据库的操作方法。通过它的方法,结合PO对数据库进行相关的操作。夹在业务逻辑与数据库资源中间。配合VO, 提供数据库的CRUD操作...

O/R Mapper 对象/关系 映射  
定义好所有的mapping之后，这个O/R Mapper可以帮我们做很多的工作。通过这些mappings,这个O/R Mapper可以生成所有的关于对象保存，删除，读取的SQL语句，我们不再需要写那么多行的DAL代码了。

对应字段验证注解的学习:

@Validated 注解:

可以在Controller类上使用, 以验证单独的Integer String字段

可以在Request类参数前使用, 以使Request类的内部验证生效

@Valid 注解:

配合@Validated 实现递归验证. 

引用:

标题: java - 将自定义验证注释应用于参数 - 代码日志 --- java - apply custom validation annotation to parameter - Stack Overflow 网址: https://stackoverflow.com/questions/73871315/apply-custom-validation-annotation-to-parameter

标题: 注解参数校验——@Vaild和@Validated在Service使用 - 掘金 网址: https://juejin.cn/post/7103206849859551268

复制属性: 使用BeanUtils.copyProperties()

### 图片上传接口

文件名: UUID 通用唯一识别码 Universally Unique Identifer

优点: 防止重名 防止爬图 

生成规则: 日期和时间 MAC地址 HashCode 随机数

每秒10亿 UUID 100年后重复概率50%

出现数据库 CreateTime 未初始化问题: 

标题: 故障分析 | MySQL 迁移后 timestamp 列 cannot be null-腾讯云开发者社区-腾讯云 网址: https://cloud.tencent.com/developer/article/1895631

标题: Column 'create_time' cannot be null问题解决_牛客博客 网址: https://blog.nowcoder.net/n/156f63c39619472fb9807b122957b934

结论: 设置: explicit_defaults_for_timestamp off

show variables like "%explicit_defaults_for_timestamp%";

```bash
sxh705@DESKTOP-3ID3JOS:/mnt/c/Users/23629$ cd /opt/1panel/apps/mysql/mysql/conf
sxh705@DESKTOP-3ID3JOS:/opt/1panel/apps/mysql/mysql/conf$ sudo su
root@DESKTOP-3ID3JOS:/opt/1panel/apps/mysql/mysql/conf# vim
# 在MySQL的my.ini文件中的[mysqld]下添加
# explicit_defaults_for_timestamp=OFF
```

出错: 服务内部错误: Error response from daemon: failed to create task for container: failed to create shim task: OCI runtime create failed: runc create failed: unable to start container process: error during container init: error mounting 

"/run/desktop/mnt/host/wsl/docker-desktop-bind-mounts/Ubuntu/f2699fa83f1524f09e7e90dd54a1421b5dc62ca7e8bcd01259e7822535e7bff3"

to rootfs at "/etc/mysql/my.cnf": mount /run/desktop/mnt/host/wsl/docker-desktop-bind-mounts/Ubuntu/f2699fa83f1524f09e7e90dd54a1421b5dc62ca7e8bcd01259e7822535e7bff3:/etc/mysql/my.cnf 

(via /proc/self/fd/6), flags: 0x5000: no such file or directory: unknown

```

Error response from daemon: failed to create task for container: failed to create shim task: OCI runtime create failed: runc create failed: unable to start container process: error during container init: error mounting 
(via /proc/self/fd/6), flags: 0x5000: no such file or directory: unknown

在 mysql 实例中执行: 

```mysql
set explicit_defaults_for_timestamp=off;
```

标题: [MYSQL] MYSQL 8解决 Invalid default value for `created_at`(timestamp) - 千千寰宇 - 博客园 网址: https://www.cnblogs.com/johnnyzen/p/18034226#_lab2_1_1

难以解决 设置为off OFF 0 似乎都是无效的 问题似乎与严格模式有关 

标题: MySQL 索引 | 菜鸟教程 网址: https://www.runoob.com/mysql/mysql-index.html

问题解决: 插入时错误使用了Mapper的insert方法而不是insertSelective, 导致插入null值, 产生冲突. 

插入时应使用insertSelective, 为null的不插入, 自动生成. 

### 自定义静态资源映射目录

上传图片后回显

配置springbootWebMvcConfig

静态资源到本地目录进行映射

演示打开图片

发生问题: 使用 file.transferTo(destFile); 方法时

destFile定位到了特殊文件夹(Tomcat下的文件夹)

解决方法: File destFile = new File(fileDirectory.getAbsolutePath() + "\\" + newFileName);

### 更新和新增商品

合并写法不可取, 新增的创建者等逻辑和更新逻辑混杂在一起, 会导致混乱

业务应该清晰独立 可拓展. 

### mybatis 使用cache缓存信息

这会阻止多实例的使用, 会产生不一致问题..

```yml
# 在 application.yml中:
mybatis:
  configuration: # 都是默认值 不必配置
    cache-enabled: true # 二级缓存 需要在Mapper的xml增加cache标签
    local-cache-scope: session # 一级缓存 sql session 单次调用级别
```

每个使用缓存的mapper使用的类都应该实现serializable

cache会在类修改后自动关闭缓存

二级缓存可以跨越Session边界使用(不同用户)

### 用户商品模块开发

### 商品详情功能

一般在controller对admin和service进行分割和参数处理

在service层进行多个mappersql查询 逻辑判断.

搜索功能: 入参判空 加%通配符 使用like关键字 实现查找功能

经验: 复杂查询应该使用query对象, 使代码不至于凌乱

使用接口定义排序字段 更新和新增商品不能使用一个接口

标题: Java中定义常量方法及建议（Class／Interface） - 简书 网址: https://www.jianshu.com/p/0affad4762ef

标题: 在IDEA中如何查看整个项目代码行数_idea查看代码总行数-CSDN博客 网址: https://blog.csdn.net/weixin_42184538/article/details/119460870


navicat调整字体大小: 

标题: 如何将字体样式/大小调整为我想要的设置？ – 纳维卡特 --- How can I adjust the font style/size to my desired setting? – Navicat 网址: https://help.navicat.com/hc/en-us/articles/217807488-How-can-I-adjust-the-font-style-size-to-my-desired-setting

排除springboot自带 /error mapper: 

标题: 删除 SpringFox Swagger-UI 中的基本错误控制器 |拜尔东 --- Remove Basic Error Controller In SpringFox Swagger-UI | Baeldung 网址: https://www.baeldung.com/spring-swagger-remove-error-controller

标题: 有关swagger的 basic-error-controller Basic Error Controller-CSDN博客 网址: https://blog.csdn.net/qq_41280118/article/details/109499481

### 缓存问题:

只有使用mybatis事务才开启缓存

Spring Boot（七）：你不能不知道的Mybatis缓存机制！ - 青梅主码的文章 - 知乎
https://zhuanlan.zhihu.com/p/142794376

标题: 玩转MySQL之四 MySQL缓存机制 - 知乎 网址: https://zhuanlan.zhihu.com/p/55947158

controller 准备外部缓存

service 纯函数, 调动业务逻辑

mapper 简单数据库操作

标题: springboot开发中常用约束注解_springboot限制长度的注解-CSDN博客 网址: https://blog.csdn.net/yuanwxcsdn/article/details/115950143

标题: 【深度思考】如何优雅的校验参数？ - 申城异乡人 - 博客园 网址: https://www.cnblogs.com/zwwhnly/p/16997650.html

标题: 以后我准备告别String.format()了，因为它不够香！ - 掘金 网址: https://juejin.cn/post/7238576503087448123   MessageFormatter.format

### @Pointcut 注解:

标题: Spring AOP切点表达式（Pointcut）详解-阿里云开发者社区 网址: https://developer.aliyun.com/article/928976

标题: Spring AOP切点表达式（Pointcut）详解-阿里云开发者社区 网址: https://developer.aliyun.com/article/928976

execution
(
  modifiers-pattern? 方法修饰符 可选
  ret-type-pattern 返回类型 必选
  declaring-type-pattern? 定义类型(方法所在的类) 可选
  name-pattern 方法名 必选
  (param-pattern) 参数类型 必选
  throws-pattern? 异常类型 可选
)

以set开始的方法
execution(* set*(..))

定义在接口中的方法
execution(* com.example.service.UserService.*(..))

任何定义在 com.example包或其子包中的方法
execution(* com.example..*(..))

其他表达式
任何com.example包中的方法
within(com.example.*)

任何实现了com.example.UserService接口的方法
this(com.example.UserService)

使用了@Transactional注解的方法
@annotation(org.springframework.transaction.annotation.Transactional)

使用了@Transactional注解的类的方法
@target(org.springframework.transaction.annotation.Transactional)

有且仅有一个参数并且参数上类型上有Transactional注解的方法
@args(org.springframework.transaction.annotation.Transactional)

标题: 声明切入点 :: Spring 框架 --- Declaring a Pointcut :: Spring Framework 网址: https://docs.spring.io/spring-framework/reference/core/aop/ataspectj/pointcuts.html

PCD表达式: 在Spring AOP（面向切面编程）中，PCD（Pointcut Designators）是用于定义切点（pointcut）的表达式语法。切点表达式决定了哪些连接点（如方法执行、字段访问等）应该被拦截，进而应用相应的通知（advice）。

```java
package com.xyz;
public class Pointcuts {
	@Pointcut("execution(public * *(..))")
	public void publicMethod() {}

	@Pointcut("within(com.xyz.trading..*)")
	public void inTrading() {}

	@Pointcut("publicMethod() && inTrading()")
	public void tradingOperation() {}
}
```

```markdown

You can combine pointcut expressions by using &&, || and !. You can also refer to pointcut expressions by name. The following example shows three pointcut expressions:
您可以使用 &&, || 和 ! 组合切入点表达式。您还可以按名称引用切入点表达式。以下示例显示了三个切入点表达式：

解释这个表达式: "execution(public * com.imooc.mall.controller.*.*(..)))"
这个pointcut表达式使用了AspectJ的切点表达式语法，用于定义Spring AOP中应当拦截的方法。我们逐步解释这个表达式：

execution(...): 这是一个执行切点，它匹配方法的执行。

public *: 这部分表示匹配所有公共（public）方法，*表示匹配任何返回类型。

com.imooc.mall.controller.*: 这部分指定了包和类名。它匹配com.imooc.mall.controller包下的所有类。星号（*）在这里表示类名的通配符，意味着匹配该包下的任何类。

*.*(...): 这部分指定了方法和参数。第一个星号（*）是方法名的通配符，表示匹配任何方法名。第二个星号（*）后面跟着的是参数列表，括号内的三个点（...）是参数类型的通配符，表示匹配任意数量和类型的参数。

综上所述，整个pointcut表达式"execution(public * com.imooc.mall.controller.*.*(..)))"的意思是：匹配com.imooc.mall.controller包下所有类的所有公共方法的执行，不论这些方法返回什么类型，也不论它们接受什么参数。

注意：这个表达式中似乎有一个多余的闭合括号，正确的表达式应该是"execution(public * com.imooc.mall.controller.*.*(..))"。

这个pointcut定义之后，你可以将它与一个通知（advice）关联起来，以便在匹配的方法执行前、执行后、抛出异常时或者环绕执行这些方法时执行一些特定的逻辑。这是Spring AOP的一个强大特性，它允许你在不修改原有代码的情况下，为应用程序添加额外的行为。


".*" : 匹配任意方法名

"..*" : 匹配任意层包名
```

```java
@Aspect
@Component
public class WebLogAspect {
    @Pointcut( "execution(public * com.imooc.mall.controller.*.*(..)))" )
    public void webLog() {}
    @Before( "webLog()" )
    public void doBefore(JoinPoint joinPoint) {}
    @AfterReturning( returning = "res", pointcut = "webLog()" )
    public void doAfterReturning(Object res) throws JsonProcessingException {}
}
```

java 调用 everything(jna方式): 标题: java调用 everything 文件快速扫描_java调用everything提供搜索接口-CSDN博客 网址: https://blog.csdn.net/weixin_35928208/article/details/107562936

java random每次启动生成的数字不同 除非显式指定了seed new Random(seed)

### 标题: @Transactional加不加rollbackFor=Exception.class的区别？-腾讯云开发者社区-腾讯云 网址: https://cloud.tencent.com/developer/article/2194567

结论: 总结一下：@Transactional只能回滚RuntimeException和RuntimeException下面的子类抛出的异常，不能回滚Exception异常。

### IDEA代码建议是区分大小写的

使用: INOOR 可以建议 ImoocMallExceptionEnum.NO_ORDER

但是不能用Inoor否则查不到

### PageHelper:

标题: Mybatis-PageHelper/wikis/zh/HowToUse.md at master · pagehelper/Mybatis-PageHelper 网址: https://github.com/pagehelper/Mybatis-PageHelper/blob/master/wikis/zh/HowToUse.md

在PageHelper.startPage后, 分页结果会被保存到list中, 需要强制类型转换得到页信息, 但是也可以用PageInfo.of方法解析信息. 

login list 等controller方法 不对数据修改的一般用get

修改数据的一般用post

