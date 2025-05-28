## 说明
neatlogic-web-alert是告警中心模块的前端代码，由于neatlogic-web的项目已经非常庞大，为了实现按需部署减少编译时间，neatlogic-web-alert作为一个独立的前端项目管理，但neatlogic-web-alert不能脱离neatlogic-web使用

## 使用方法
- 先拉取neatlogic-web项目代码，具体请看neatlogic-web相关文档。
- 进入neatlogic-web/src/community-module目录，拉取neatlogic-web-alert代码，执行命令：git clone git地址 alert，<span style="color:red;font-weight:bold;">注意：</span>目录名称一定要是alert，不能修改，目录名称是和后端代码配对好的。
- 正常编译neatlogic-web项目就会自动加上neatlogic-web-aler模块。

