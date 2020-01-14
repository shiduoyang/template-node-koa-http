# backend-http-nodejs

backend-http-nodejs是nodejs环境HTTP服务端框架。

## 特点

* 接口文档xx.yaml建立后可直接访问，无需手动配置router
* 接口文档xx.yaml中声明的接口，可自动生成接口文件并直接访问
* 得益于sequelize和sequelize-cli，在mysql中建表更加简单

## 如何新增接口

### 1：在接口文档中的paths下，增加接口定义如

```yaml
paths:
  /common/login:
    post:
      tags:
        - tagTest
      summary: summary test login
      description: description test login
      parameters:
        - name: p1
          type: string
          in: formData
          required: true
        - name: p2
          type: number
          in: formData
          required: true
      responses:
        200:
          description: successful
          schema:
            type: object
```

### 2：在NODE_ENV=development的状态下重启

```shell
# linux && mac
export NODE_ENV='development' && node server.js
# windows
set NODE_ENV='development' && node server.js
# pm2
pm2 start ecosystem.config.js --env development
```

### 3：完成后查看并测试

* controller文件夹下新建（或更新）了对应的接口文件，在这里进行接口的进一步开发。
* 访问swagger，点击接口进行测试，将返回: {code:200}

## 如何新增mysql数据表

得益于开源包sequelize-cli，可以使用以下方式在相连的mysql数据库中新建数据表，更加详细的说明请参考：[sequelize-cli](https://github.com/sequelize/cli)

* 生成用于连接数据库的模型文件（models/xx.js）和用于迁移数据库到mysql的迁移文件（migrations/xx.js）

```shell
npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string
```

* 将表结构迁移到mysql数据库

```shell
npx sequelize-cli db:migrate
```

## 如何自定义接口组织的方式

此类接口不要在config/controller/xx.yaml文件中声明，如需要声明，请选择其他位置
此类接口需要手动建立router并使用

### End
