
# 扶贫平台 表设计

1. 贫困户基本信息表

该表主要用于存储贫困户的基本信息。

建表语句：

sql
CREATE TABLE poverty_households (  
    id INT PRIMARY KEY AUTO_INCREMENT,  
    household_name VARCHAR(255) NOT NULL,  
    address VARCHAR(255),  
    population INT,  
    poverty_level VARCHAR(100),  
    registration_date DATE,  
    status VARCHAR(50) -- 例如：'待帮扶', '帮扶中', '已脱贫'等  
);
2. 贫困户需求情况表

该表主要用于记录贫困户的具体需求。

建表语句：

sql
CREATE TABLE poverty_needs (  
    id INT PRIMARY KEY AUTO_INCREMENT,  
    household_id INT,  
    need_category VARCHAR(100), -- 例如：'教育', '医疗', '住房'等  
    need_description TEXT,  
    FOREIGN KEY (household_id) REFERENCES poverty_households(id)  
);
3. 扶贫项目表

该表用于记录扶贫项目的相关信息。

建表语句：

sql
CREATE TABLE poverty_alleviation_projects (  
    id INT PRIMARY KEY AUTO_INCREMENT,  
    project_name VARCHAR(255) NOT NULL,  
    project_type VARCHAR(100),  
    budget DECIMAL(10,2),  
    start_date DATE,  
    end_date DATE,  
    status VARCHAR(50) -- 例如：'规划中', '进行中', '已完成'等  
);
4. 扶贫资金使用情况表

该表用于记录扶贫资金的使用和预算情况。

建表语句：

sql
CREATE TABLE poverty_funds (  
    id INT PRIMARY KEY AUTO_INCREMENT,  
    project_id INT,  
    budget DECIMAL(10,2),  
    used_amount DECIMAL(10,2),  
    remaining_amount DECIMAL(10,2),  
    usage_description TEXT,  
    FOREIGN KEY (project_id) REFERENCES poverty_alleviation_projects(id)  
);
5. 贫困户帮扶情况表

该表用于记录贫困户的帮扶过程和结果。

建表语句：

sql
CREATE TABLE poverty_assistance (  
    id INT PRIMARY KEY AUTO_INCREMENT,  
    household_id INT,  
    project_id INT,  
    start_date DATE,  
    end_date DATE,  
    assistance_outcome TEXT,  
    FOREIGN KEY (household_id) REFERENCES poverty_households(id),  
    FOREIGN KEY (project_id) REFERENCES poverty_alleviation_projects(id)  
);
这些只是一些基本的建议，具体的数据库设计还需要根据实际的业务需求和数据进行调整和优化。在实际应用中，还需要考虑数据完整性、安全性、性能优化等因素。

# 扶贫平台 测试数据插入

以下是基于上述表结构生成的测试数据，每个表包含20条记录：

**1. 贫困户基本信息表 (`poverty_households`)**

```
INSERT INTO poverty_households (household_name, address, population, poverty_level, registration_date, status) VALUES
('张三家', '某县某村1号', 4, '深度贫困', '2020-01-01', '帮扶中'),
('李四家', '某县某村2号', 3, '中度贫困', '2020-02-01', '待帮扶'),
('王五家', '某县某村3号', 5, '轻度贫困', '2020-03-01', '已脱贫'),
-- ... (其他17条记录，可以使用类似方式填充)
('赵十家', '某县某村20号', 2, '深度贫困', '2020-12-01', '帮扶中');
```

**2. 贫困户需求情况表 (`poverty_needs`)**

```
INSERT INTO poverty_needs (household_id, need_category, need_description) VALUES
(1, '教育', '需要资助两个孩子的学费'),
(2, '医疗', '需要支付手术费用'),
(3, '住房', '需要修缮破旧房屋'),
-- ... (其他17条记录，可以关联到不同的贫困户，并描述不同的需求)
(20, '教育', '需要资助一个孩子上大学');
```

**3. 扶贫项目表 (`poverty_alleviation_projects`)**

```
INSERT INTO poverty_alleviation_projects (project_name, project_type, budget, start_date, end_date, status) VALUES
('教育扶贫项目', '教育', 100000.00, '2020-01-15', '2021-01-15', '进行中'),
('医疗扶贫项目', '医疗', 80000.00, '2020-02-15', '2020-12-15', '已完成'),
('住房改造项目', '住房', 120000.00, '2020-03-15', '2021-03-15', '规划中'),
-- ... (其他17条记录，描述不同的扶贫项目)
('农业产业扶贫', '农业', 150000.00, '2020-12-15', '2021-12-15', '进行中');
```

**4. 扶贫资金使用情况表 (`poverty_funds`)**

```
INSERT INTO poverty_funds (project_id, budget, used_amount, remaining_amount, usage_description) VALUES
(1, 100000.00, 50000.00, 50000.00, '已支付部分教育费用'),
(2, 80000.00, 80000.00, 0.00, '已全额支付医疗费用'),
(3, 120000.00, 20000.00, 100000.00, '初期材料采购费用'),
-- ... (其他17条记录，描述不同项目的资金使用情况)
(20, 150000.00, 75000.00, 75000.00, '已支付部分农业投入');
```

**5. 贫困户帮扶情况表 (`poverty_assistance`)**

```
INSERT INTO poverty_assistance (household_id, project_id, start_date, end_date, assistance_outcome) VALUES
(1, 1, '2020-01-20', '2021-01-20', '孩子已入学，学费已支付'),
(2, 2, '2020-02-20', '2020-12-20', '手术成功，已恢复健康'),
(3, 3, '2020-03-20', NULL, '房屋改造进行中'),
-- ... (其他17条记录，描述不同贫困户的帮扶情况)
(20, 4, '2020-12-20', NULL, '农业项目启动，初期投入完成');
```

请注意，以上插入语句中的日期、金额等字段的值只是示例，您可能需要根据实际业务逻辑和数据需求进行调整。另外，`NULL`值表示该字段尚未填写或尚未发生（例如，帮扶尚未结束，则`end_date`为`NULL`）。在实际应用中，您可能还需要考虑数据的一致性和完整性，确保外键约束得到正确应用，并遵循数据库设计时的业务规则。


当然，如果您需要一个用于管理扶贫工作的管理员信息表（`poverty_admin`），下面是一个可能的表定义SQL：

```sql
CREATE TABLE poverty_admin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    real_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 例如：'管理员', '数据录入员', '审核员'等
    email VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE -- 表示管理员账号是否激活
);
```

这个`poverty_admin`表包含了管理员的基本信息，如用户名、密码、真实姓名、角色、邮箱、电话等。`created_at`字段记录了管理员账号的创建时间，`updated_at`字段记录了管理员信息的最后更新时间，使用了TIMESTAMP类型并自动设置当前时间戳。`is_active`字段用于标记管理员账号是否处于激活状态。

在实际应用中，密码字段通常会以加密形式存储，而不是明文。因此，您可能需要使用适当的密码哈希算法（如bcrypt）对密码进行加密处理，确保安全性。

此外，根据业务需要，您可能还需要添加其他字段，比如管理员的权限控制字段、登录尝试次数限制字段等。

请注意，这个表定义只是一个基础示例，您可能需要根据实际的业务逻辑和安全需求进行调整和扩展。

以下是为`poverty_admin`表生成的5条记录示例：

```sql
INSERT INTO poverty_admin (username, password, real_name, role, email, phone, is_active) VALUES
('admin1', 'encrypted_password1', '张三', '管理员', 'admin1@example.com', '13800138001', TRUE),
('data_entry', 'encrypted_password2', '李四', '数据录入员', 'data_entry@example.com', '13900139002', TRUE),
('auditor', 'encrypted_password3', '王五', '审核员', 'auditor@example.com', '13700137003', TRUE),
('supervisor', 'encrypted_password4', '赵六', '监督员', 'supervisor@example.com', '13600136004', TRUE),
('backup_admin', 'encrypted_password5', '孙七', '备份管理员', 'backup_admin@example.com', '13500135005', TRUE);
```

请注意，上述SQL语句中的`password`字段值`encrypted_passwordX`应该是经过加密处理的密码字符串，而不是明文密码。在实际操作中，您应该使用安全的方式（如哈希算法）对密码进行加密，并存储加密后的密码值。

此外，`email`和`phone`字段中的值也是示例，您需要根据实际情况填写有效的电子邮件地址和电话号码。

`is_active`字段设置为`TRUE`，表示这些管理员账号都是激活状态。如果您需要创建未激活的账号，可以将`is_active`字段设置为`FALSE`。

记得在实际操作前替换示例中的密码和联系信息为真实的加密密码和有效的联系方式。

标题: 在线文字压缩，去空格、换行符等 网址: http://www.wuqianling.top/software/notepad/compress.html

vscode补全属性: ctrl+.

```yml
根据以上java controller代码, 完成js格式的axios异步请求代码,其中的内部类已经提前定义在js中,直接使用即可,把请求封装成api库,每个请求封装成一个异步javascript方法, 封装到一个api对象中export到外部
请求示例：
controller的getmapping方法中的body参数
"await axios.get(url, body)"
controller的postmapping方法中的query参数
"await axios.post(url, null, {params: data,})"
controller的postmapping方法中的body参数 
"await axios.post(url, body)"
不需要try catch处理异常,因为调用者会进行处理, 使用async进行异步请求.
不需要设置baseUrl,因为axios实例已经进行默认设置.
```

gitlab令牌：到2025.4.10
(base64) Z2xwYXQtTlZnN0YtNWVROEZ4eEd3VmQxdkw=

gitlab仓库：
https://gitlab.com/sxh7051/fp_plat.git


标题: 使用 OpenAPI Typescript Codegen 一键生成前端接口代码_openapi-typescript-codegen-CSDN博客 网址: https://blog.csdn.net/trinityleo5/article/details/133282852

标题: 如何在前端项目快速生成后端接口_有没有可能前端 应用公园生成 后端自己做-CSDN博客 网址: https://blog.csdn.net/m0_51732378/article/details/134748803

标题: 首页 ·ferdikoomen/openapi-typescript-codegen 维基 网址: https://github.com/ferdikoomen/openapi-typescript-codegen

标题: Pico.css - 简单优雅的纯 CSS 开源 UI 框架，用原始的 HTML 元素标签来做界面｜那些免费的砖 网址: https://www.thosefree.com/pico-css
