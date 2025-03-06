# SQL Beautify Pro

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?logo=github)](https://github.com/bearben2575/vscode-sql-formatter-idea)
![Version](https://img.shields.io/visual-studio-marketplace/v/bearben2757.sql-beautify)
![Installs](https://img.shields.io/visual-studio-marketplace/i/bearben2757.sql-beautify)
![Rating](https://img.shields.io/visual-studio-marketplace/r/bearben2757.sql-beautify)
![License](https://img.shields.io/github/license/bearben2575/vscode-sql-formatter-idea)
![GitHub stars](https://img.shields.io/github/stars/bearben2575/vscode-sql-formatter-idea?style=social)

</div>

一个强大的 SQL 格式化工具，专为 VSCode 打造。支持标准 SQL 和 MyBatis 语法，让您的 SQL 代码更加整洁美观。

📦 [插件市场](https://marketplace.visualstudio.com/items?itemName=bearben2757.sql-beautify) | 
📚 [GitHub](https://github.com/bearben2575/vscode-sql-formatter-idea) | 
[English](README_EN.md) | 
简体中文

## ✨ 特性

- 🎯 智能 SQL 格式化，支持多种 SQL 方言
- 💡 完美支持 MyBatis 参数占位符（如 `#{paramName}`）
- 🔄 自动转换为字符串拼接格式
- ⚡ 快速格式化，支持快捷键操作
- 🎨 保持代码缩进和对齐
- 🛠 可自定义的格式化规则

## 📥 安装

在 VS Code 中有三种安装方式：

1. 在扩展商店中搜索 "SQL Beautify Pro"
2. 快捷键 `Ctrl+P`，输入 `ext install bearben2757.sql-beautify`
3. [点击这里](https://marketplace.visualstudio.com/items?itemName=bearben2757.sql-beautify)直接在浏览器中安装

## 🚀 使用方法

1. 选择要格式化的 SQL 代码
2. 使用以下方式之一触发格式化：
   - 快捷键：`Ctrl+Shift+F`（Windows/Linux）或 `Cmd+Shift+F`（Mac）
   - 命令面板：`Ctrl+Shift+P` 后输入 "Format SQL Text"
   - 右键菜单：选择 "Format SQL Text"

## 📝 示例

### 输入：
```sql
select u.name,u.age,d.dept_name from user u left join department d on u.dept_id=d.id where u.age>#{minAge} and u.create_time>=#{startTime}
```

### 输出：
```sql
SELECT u.name, u.age, d.dept_name " +
"    FROM user u " +
"    LEFT JOIN department d ON u.dept_id = d.id " +
"    WHERE u.age > #{minAge} " +
"    AND u.create_time >= #{startTime}
```

## ⚙️ 配置选项

您可以通过 VS Code 的设置来自定义插件的行为。打开设置的方式：
1. 使用快捷键 `Ctrl+,`（Windows/Linux）或 `Cmd+,`（Mac）
2. 搜索 "SQL Beautify Pro"
3. 或者在 settings.json 中直接编辑

```jsonc
{
  "sql-beautify.indentSize": 4,        // 缩进空格数
  "sql-beautify.keywordCase": "upper", // 关键字大小写: "upper" | "lower"
  "sql-beautify.lineStyle": "standard" // 换行风格: "standard" | "compact"
}
```

| 配置项 | 默认值 | 可选值 | 说明 |
|--------|--------|--------|------|
| `sql-beautify.indentSize` | `4` | `1-8` | 代码缩进的空格数量 |
| `sql-beautify.keywordCase` | `"upper"` | `"upper"`, `"lower"` | SQL 关键字的大小写形式 |
| `sql-beautify.lineStyle` | `"standard"` | `"standard"`, `"compact"` | 控制换行和缩进的方式 |

### 配置示例

1. **标准格式**（默认）：
```sql
SELECT column1, column2
    FROM table1
    WHERE condition = true
```

2. **紧凑格式**：
```sql
SELECT column1, column2 FROM table1
    WHERE condition = true
```

3. **小写关键字**：
```sql
select column1, column2
    from table1
    where condition = true
```

## 🔍 支持的语法

- **标准 SQL**：
  - SELECT, INSERT, UPDATE, DELETE 语句
  - CREATE, ALTER, DROP 语句
  - WHERE, GROUP BY, HAVING, ORDER BY 子句
  - 子查询和 JOIN 操作

- **MyBatis 特性**：
  - 简单参数：`#{paramName}`
  - 对象参数：`#{user.name}`
  - 带类型参数：`#{amount,jdbcType=DECIMAL}`
  - 动态 SQL 标签

## 🐛 问题反馈

如果您遇到问题或有改进建议，欢迎：
- [提交 Issue](https://github.com/bearben2575/vscode-sql-formatter-idea/issues)
- [发起 Pull Request](https://github.com/bearben2575/vscode-sql-formatter-idea/pulls)

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证。

## 📝 更新日志

### 0.0.3 (2024-03-06)
- 🎨 添加插件图标
- 💅 优化插件展示效果

### 0.0.2 (2024-03-06)
- ⚙️ 添加自定义配置支持
  - 缩进大小配置（1-8个空格）
  - SQL关键字大小写配置
  - 格式化样式配置（标准/紧凑）
- 🎨 优化代码格式化逻辑
- 📚 完善文档和示例

### 0.0.1 (2024-03-06)
- 🎉 首次发布
- ✨ 基础 SQL 格式化功能
- 🔧 MyBatis 参数占位符支持
- ⌨️ 快捷键支持 