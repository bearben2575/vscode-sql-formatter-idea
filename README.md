# SQL Beautify

一个用于格式化 SQL 文本的 VSCode 扩展，特别支持 MyBatis 参数占位符的处理。

## 功能特点

- SQL 代码格式化和美化
- 支持 MyBatis 参数占位符（如 `#{paramName}`）
- 自动转换为字符串拼接格式
- 支持自定义快捷键

## 使用方法

1. 在编辑器中选择要格式化的 SQL 代码
2. 使用快捷键 `Ctrl+Shift+F`（Windows/Linux）或 `Cmd+Shift+F`（Mac）
3. 或者打开命令面板（`Ctrl+Shift+P`），输入 "Format SQL Text"

## 示例

### 输入：
```sql
update opc_server_config set state_connect = #{type} where current_server = 1
```

### 输出：
```sql
UPDATE opc_server_config " + 
"    SET state_connect = #{type} " + 
"    WHERE current_server = 1
```

## 配置选项

插件使用以下默认配置：
- 缩进：4个空格
- SQL关键字：大写
- 查询间隔：2个空行

## 支持的语法

- 标准 SQL 语句
- MyBatis 参数占位符：
  - 简单参数：`#{paramName}`
  - 复杂参数：`#{user.name}`
  - 带类型参数：`#{param,jdbcType=VARCHAR}`
 
![PixPin_2025-03-06_12-28-35](https://github.com/user-attachments/assets/ad78e093-4359-4c03-83ed-21bfc08d1227)


## 问题反馈

如果您遇到任何问题或有建议，请在 GitHub 上提交 issue。

## 许可证

MIT

## 更新日志

### 0.0.1
- 初始版本发布
- 基本的 SQL 格式化功能
- MyBatis 参数占位符支持 
