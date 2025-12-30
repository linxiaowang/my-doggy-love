# 构建卡住问题解决方案

## 问题描述

在服务器部署时（执行 `deploy.sh` 或 `quick-deploy.sh`），构建过程会卡在以下位置：
- "Building Nuxt Nitro server (preset: node-server, compatibility date: 2024-08-14)"
- 或者之前卡在 "vite v7.1.12 building SSR bundle for production... transforming (163) components/ui/button/index.ts"

## 根本原因

这个问题的主要原因是：
1. **僵尸进程残留**：上一次构建失败的 Node.js 进程没有完全退出，导致文件锁或端口冲突
2. **缓存文件损坏**：构建缓存文件可能损坏或处于不一致状态
3. **内存泄漏**：长时间运行的 Node.js 进程可能占用大量内存

这解释了为什么**重启服务器后重新打包就能正常**——重启会清理所有进程和临时文件。

## 解决方案

### 自动清理（推荐）

所有部署脚本已经更新，在构建前会自动清理：
- ✅ `deploy.sh` - 完整部署脚本
- ✅ `quick-deploy.sh` - 快速部署脚本
- ✅ `build.sh` - 单独构建脚本

这些脚本现在会在构建前自动：
1. 杀掉所有可能卡住的 Node.js 构建进程（nuxt/vite/nitro/prisma）
2. 清理所有构建缓存（.nuxt/.output/.nitro 等）
3. 清理 Nuxt 持久化缓存（~/.nuxt）

### 手动清理

如果构建仍然卡住，可以手动运行清理脚本：

```bash
./cleanup.sh
```

或者手动执行：

```bash
# 停止构建进程
pkill -9 -f "node.*nuxt"
pkill -9 -f "node.*vite"
pkill -9 -f "node.*nitro"
pkill -9 -f "npx.*prisma"

# 清理缓存
rm -rf .nuxt .output node_modules/.vite .nitro node_modules/.cache ~/.nuxt

# 重新构建
./build.sh
```

## 构建优化

### 已实施的优化

1. **增加 Node.js 内存限制** (4GB)
   - 在 `.npmrc` 中配置：`node-options=--max-old-space-size=4096`

2. **禁用 ESLint 构建检查**
   - 在 `nuxt.config.ts` 中禁用了 `@nuxt/eslint` 模块
   - 设置 `lintOnBuild: false`

3. **优化并行构建**
   - 禁用 Vite 并行构建：`parallel: false`
   - 限制 Nitro worker 线程：`threadCount: 1`

4. **优化依赖处理**
   - 预构建关键依赖（vue、pinia、@vueuse/core 等）
   - 优化 SSR 外部化配置
   - 手动代码分割（UI 组件、vendor）

5. **禁用 TypeScript 类型检查**
   - Nitro 中禁用严格模式和类型检查

## 调试构建

如果需要详细日志来诊断问题：

```bash
./build-debug.sh
```

这会生成 `build-debug.log` 文件，包含详细的构建日志。

## 预防措施

### 1. 使用 Swap 空间

服务器应该配置足够的 Swap 空间（至少 2GB），部署脚本会自动配置：

```bash
./quick-deploy.sh --swap
```

### 2. 定期清理

如果频繁部署，建议定期运行清理脚本：

```bash
./cleanup.sh
```

### 3. 监控进程

检查是否有卡住的 Node.js 进程：

```bash
ps aux | grep -E "(nuxt|vite|nitro)" | grep -v grep
```

如果有残留进程，可以手动杀掉：

```bash
pkill -9 -f "node.*nuxt"
```

## 常见问题

### Q: 为什么重启服务器后就能正常构建？

A: 因为重启会：
- 清理所有进程（包括僵尸进程）
- 清理所有内存中的临时数据
- 释放所有文件锁

现在我们的脚本在构建前会自动执行这些清理步骤，所以不需要重启服务器。

### Q: 构建需要多长时间？

A: 正常情况下：
- Vite 客户端构建：30-60 秒
- Vite SSR 构建：20-40 秒
- PWA 生成：1-5 秒
- Nitro 服务器构建：20-40 秒
- **总计：约 2-3 分钟**

如果超过 5 分钟，说明可能卡住了，按 Ctrl+C 中止，然后运行 `./cleanup.sh` 清理。

### Q: 如何判断构建是否卡住？

A: 如果某个阶段超过预期时间没有输出：
- Vite 构建：超过 2 分钟
- Nitro 构建：超过 1 分钟
- 整体构建：超过 5 分钟

可以按 Ctrl+C 中止，检查是否有卡住的进程。

## 更新日志

### 2025-12-30
- ✅ 在所有构建脚本中添加进程清理步骤
- ✅ 清理所有构建缓存（包括 ~/.nuxt）
- ✅ 添加 `cleanup.sh` 独立清理脚本
- ✅ 添加详细的构建诊断提示
