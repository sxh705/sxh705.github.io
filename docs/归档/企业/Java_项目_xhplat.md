## 苏欣昊的论坛 初始化

package io.github.sxh705.mall.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 测试环境下允许跨域访问
 */
@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOriginPatterns("*") // 允许跨域的域名，可以用*表示允许任何域名使用
                        // .allowedOrigins("http://localhost:3004/", "http://localhost:7070", "http://localhost:8000")
                        // 在Springboot2.4对应Spring5.3后在设置allowCredentials(true)的基础上不能直接使用通配符设置allowedOrigins，而是需要指定特定的URL。如果需要设置通配符，需要通过allowedOriginPatterns指定
                        .allowedMethods("GET", "POST", "DELETE", "PUT") // 允许任何方法（post、get等）
                        .allowedHeaders("*") // 允许任何请求头
                        .allowCredentials(true) // 带上cookie信息
                        .exposedHeaders(HttpHeaders.SET_COOKIE).maxAge(3600L); // maxAge(3600)表明在3600秒内，不需要再发送预检验请求，可以缓存该结果
            }
        };
    }
}

标题: SpringDoc注解解析-CSDN博客 网址: https://blog.csdn.net/qq_29012499/article/details/135433483

# 使用springdoc

springfox swagger 在springboot2.3停止更新 改为springdoc

标题: SpringBoot的API文档生成工具SpringDoc使用详解_java_脚本之家 网址: https://www.jb51.net/article/252272.htm

# 使用webfilter

一定要写dofilter语句否则filter链不会继续处理..

标题: SpringBoot 中使用 Filter 的正确姿势 - 郑晓龙 - 博客园 网址: https://www.cnblogs.com/zhengxl5566/p/13266278.html

# @NotNull @Validated 注解:

需要引入pom文件:

```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

标题: 在方法参数上使用@NotNull |拜尔东 --- Using @NotNull on a Method Parameter | Baeldung 网址: https://www.baeldung.com/java-notnull-method-parameter

# 故障统一处理:

@RestControllerAdvice

需要引入 AOP
```
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

# IDEA快捷键

标题: IDEA 工作中最常用的快捷键_idea怎么设置切换页签快捷键-CSDN博客 网址: https://blog.csdn.net/weixin_42139662/article/details/125126577

# 安装javafx

标题: 使用 jdk11 + maven 开发 JavaFX_jdk11 maven如何写-CSDN博客 网址: https://blog.csdn.net/xizi1103/article/details/104008383

# 处理json格式:
使用 @RequestBody注解 只对json vo对象有效 一个方法修饰只能有一个@requestbody

标题: @requestBody注解的使用 - 西风恶 - 博客园 网址: https://www.cnblogs.com/qiankun-site/p/5774300.html

# 处理url param格式
使用 @RequestParam注解 不论是简单对象还是VO对象

# sql中的 boolean转byte: byte类型不是bool类型

需要约定俗成的规定, 一般认为0为false, 1为true

但是碰到多权限认证的拓展情况就会比较乏力 那时需要增加字段解决

标题: MySQL boolean类型 - MySQL教程 网址: https://www.yiibai.com/mysql/boolean.html

标题: mybatis —— 动态sql之if条件判断各种使用方式 - sumlen - 博客园 网址: https://www.cnblogs.com/sumlen/p/11130554.html

# mybatis-plus分页: 语句后面不要加分号要不分页模块会出错..