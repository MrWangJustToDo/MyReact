# MyReact RSC vs `@vitejs/plugin-rsc` — 能力对比与差距追踪

> **目的**：对照官方 [vitejs/vite-plugin-react](https://github.com/vitejs/vite-plugin-react/tree/main) 的 [`@vitejs/plugin-rsc`](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-rsc)，弄清 MyReact 已做 / 未做 / 底层差异，并作为后续补齐清单。  
> **基线**：`@vitejs/plugin-rsc@0.5.32`（`tmp/vite-plugin-react` @ `c185eaa`）  
> **MyReact**：`@my-react/react-server@0.3.30` + `@my-react/react-vite/rsc`（workspace）  
> **更新日期**：2026-07-31

图例：

| 符号 | 含义                                            |
| ---- | ----------------------------------------------- |
| ✅   | 已实现且可在 `ui/rsc-example`（或等价路径）走通 |
| ◐    | 部分实现 / 简化 / 有已知缺口                    |
| ❌   | 未实现                                          |
| —    | 不适用（架构选择不同）                          |

相关内部设计：[`openspec/changes/implement-rsc/`](../../openspec/changes/implement-rsc/)。  
**已实现路径的漏洞/错误审计**：[RSC-AUDIT.md](./RSC-AUDIT.md)（多数 High/Medium 已修；A6 suspend 已修；A3 闭包加密仍开）。

---

## 1. 一句话心智模型

```
┌──────────────────────────────┐     ┌──────────────────────────────────────────┐
│ @vitejs/plugin-rsc           │     │ MyReact                                  │
│                              │     │                                          │
│ Vite Environments API        │     │ Vite Environments API（同类三环境）        │
│  + react-server-dom-*        │     │  + @lazarv/rsc（Flight 协议替代实现）       │
│  （官方 React Flight）        │     │  + @my-react/react-server 适配层           │
│  框架无关 bundler 原语        │     │  + @my-react/react-dom/server 做 HTML SSR  │
└──────────────────────────────┘     └──────────────────────────────────────────┘
```

**相同点**：都按 `rsc` / `ssr` / `client` 三环境拆包；都做 `"use client"` / `"use server"` 变换；都把 Flight stream tee 到 SSR HTML + 浏览器 hydrate。

**最大底层差异**：官方挂在 **`react-server-dom-webpack`（或 vendored 副本）**；MyReact 挂在 **`@lazarv/rsc`**，再用 MyReact reconciler / DOM SSR 消费解码后的树。这不是「差一个 API」级别的差距，而是 **Flight 运行时与 React 官方协议实现对齐程度** 的差距。

---

## 2. 架构对照

| 维度          | `@vitejs/plugin-rsc`                                                             | MyReact                                                             |
| ------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 定位          | 框架无关 RSC **bundler + runtime shim**                                          | MyReact 专用 RSC **适配层 + Vite 插件**                             |
| Flight 编解码 | `react-server-dom`（server/client/static/browser）                               | `@lazarv/rsc` → `@my-react/react-server`                            |
| HTML SSR      | 用户用 `react-dom/server`                                                        | `@my-react/react-dom/server`（`createFlightServer.renderToStream`） |
| 环境拆分      | Vite Environment API：`rsc` / `ssr` / `client`                                   | 同构三环境（`build-plugin` / `conditions-plugin`）                  |
| 跨环境加载    | `import.meta.viteRsc.loadModule`（含 Cloudflare / worker proxy）                 | `import.meta.viteRsc.loadModule`（`cross-env-plugin`）              |
| CSS           | 自动拆分注入 + `loadCss()`                                                       | ◐ 依赖普通 Vite CSS；无官方级 SC CSS 注入启发式                     |
| HMR           | ✅ client + server components                                                    | ❌ SC HMR deferred（openspec task 16.3）                            |
| 加密闭包      | ✅ `"use server"` 闭包参数加密密钥                                               | ❌                                                                  |
| 测试矩阵      | Playwright e2e + 大量 transform unit tests                                       | ◐ 少量 / openspec 标 hydration e2e 未完成                           |
| 示例覆盖      | starter / basic / ssg / ppr / no-ssr / use-cache / browser-mode / react-router … | 仅 `ui/rsc-example`                                                 |

典型数据流（两边相同）：

```
rsc env:  SC tree ──renderToReadableStream──► Flight
                │                                │
                ├──────────────────► ssr: createFromReadableStream → HTML
                └──────────────────► browser: createFromReadableStream → hydrate
```

---

## 3. 功能矩阵（追踪主表）

### 3.1 Bundler / 指令变换

| 能力                                    |               Official               |              MyReact              | 备注 / 追踪                                                                    |
| --------------------------------------- | :----------------------------------: | :-------------------------------: | ------------------------------------------------------------------------------ |
| `"use client"` → client reference proxy |                  ✅                  |                ✅                 | `myreact-vite/src/rsc/transforms/client-codegen.ts`                            |
| `"use server"` 文件级 server reference  |                  ✅                  |                ✅                 | `transform-server-action.ts` / `server-codegen.ts`                             |
| 内联 `"use server"` hoist               |                  ✅                  |                ✅                 | `transform-hoist-inline.ts`；官方 transform 测试更全（export all / re-export） |
| `export *` / re-export 边界展开         |                  ✅                  |                 ◐                 | 官方 `expand-export-all`；MyReact 需核对 edge cases                            |
| `react-server` resolve condition        |                  ✅                  |                ✅                 | `conditions-plugin.ts`                                                         |
| `server-only` / `client-only` 导入校验  |         ✅ `validateImports`         | ✅ `validateImports`（默认 true） | `createValidateImportsPlugin`                                                  |
| CJS interop（client-in-server 等）      | ✅ `plugins/cjs.ts` + basic fixtures |                 ◐                 | 官方 basic 有大量 `test-dep/*`；MyReact 未系统覆盖                             |
| Scan build 发现边界                     |                  ✅                  |                ✅                 | `scan-plugin.ts`                                                               |
| Source map 对齐（action hoist）         |                  ✅                  |                 ◐                 | 官方 `find-source-map-url` / transform tests                                   |
| 自定义 Server Function 指令（claims）   |              ✅ example              |                ❌                 | P2 扩展点                                                                      |
| `"use cache"` / callable cache 变换     |             ✅ examples              |                ❌                 | 依赖 React cache 语义 + 官方 transform 生态；P2                                |

### 3.2 运行时 / Flight API

| 能力                                                  |       Official        |                    MyReact                    | 备注 / 追踪                                          |
| ----------------------------------------------------- | :-------------------: | :-------------------------------------------: | ---------------------------------------------------- |
| `renderToReadableStream`（RSC）                       | ✅ `react-server-dom` | ✅ via `@lazarv/rsc` + `renderToFlightStream` | 协议兼容性需持续对拍                                 |
| `createFromReadableStream`（SSR / browser）           |          ✅           |                      ✅                       | `createFlightServer` / `createFlightClient`          |
| `createFromFetch`                                     |          ✅           |                      ✅                       |                                                      |
| `encodeReply` / `decodeReply`                         |          ✅           |                      ✅                       |                                                      |
| `decodeAction` / FormData actions                     |          ✅           |                      ✅                       | `action-handler.ts`                                  |
| `decodeFormState`                                     |          ✅           |                    ❌ / ◐                     | 核对 `@lazarv/rsc` 是否暴露；P1                      |
| `loadServerAction`                                    |          ✅           |       ◐ `getServerAction` 自建 registry       | 非同名官方 API                                       |
| `registerClientReference` / `registerServerReference` |          ✅           |                      ✅                       |                                                      |
| `createClientModuleProxy`                             |          ✅           |                      ✅                       |                                                      |
| Temporary reference set                               |          ✅           |                    ❌ / ◐                     | 官方 `createTemporaryReferenceSet`；闭包加密相关；P1 |
| `prerender`（static.edge）                            |          ✅           |                      ❌                       | SSG/PPR 基础；P1                                     |
| `onClientReference`（Vite 扩展）                      |          ✅           |                      ❌                       | CSS/JS dep 收集钩子；P2                              |
| `setServerCallback`（browser）                        |          ✅           |              ◐ 自建 `callServer`              | API 形状不同                                         |
| Vendored / 可替换 `react-server-dom`                  |          ✅           |                       —                       | MyReact 锁定 `@lazarv/rsc` experimental              |

### 3.3 Vite 插件体验 / Dev & Build

| 能力                                   |  Official   |                       MyReact                        | 备注 / 追踪                                       |
| -------------------------------------- | :---------: | :--------------------------------------------------: | ------------------------------------------------- | ------- | --- |
| `rsc({ entries })` 统一插件            |     ✅      |            ✅ `@my-react/react-vite/rsc`             | 根 README 仍写 `react({ rsc: true })`（文档过时） |
| 默认 serverHandler 中间件              |     ✅      |     ◐ 自建 `/__rsc` + `/__rsc_action` + HTML SSR     | 路径可配；行为更「示例级」                        |
| HTML + Flight 注入                     |     ✅      |           ✅ `rsc-html-stream` + bootstrap           |                                                   |
| SC / CC HMR                            |     ✅      |      ✅ Phase 1 SC（`rsc:update`）+ CC Refresh       | Phase 2 边界级未做                                |
| `loadModuleDevProxy`（跨 runtime RPC） |     ✅      |                          ❌                          | Cloudflare 等；P2                                 |
| `defineEncryptionKey`                  |     ✅      |                          ❌                          | P1（与闭包绑定安全相关）                          |
| `rscCssTransform` / `loadCss()`        |     ✅      |                          ❌                          | P1                                                |
| Production 纯 Node 跑 dist             | ✅ 生态成熟 | ✅ `handler(Request)` + `server.mjs` import dist/rsc |                                                   |
| Multi-env 产物目录                     |     ✅      |                     ✅ `dist/rsc                     | ssr                                               | client` |     |
| 浏览器内跑 RSC（browser-mode）         |     ✅      |                          ❌                          | P3                                                |
| no-ssr（仅 Flight + client）           |     ✅      |                          ❌                          | P2                                                |
| SSG / PPR 示例级能力                   |     ✅      |                          ❌                          | P2                                                |
| React Router RSC 集成                  | ✅ example  |                          ❌                          | P3                                                |
| E2E（Playwright）矩阵                  |     ✅      |                          ❌                          | P0 质量保障                                       |

### 3.4 框架层（官方不做 / MyReact 自有）

| 能力                        |  Official   |             MyReact              | 备注                                              |
| --------------------------- | :---------: | :------------------------------: | ------------------------------------------------- |
| 提供完整 UI 框架            | ❌（原语）  |          ◐ MyReact 自身          | 官方故意框架无关                                  |
| `use()` / `cache()`         | 来自 React  |       ✅ `@my-react/react`       |                                                   |
| Suspense 流式 HTML          | `react-dom` |      ✅ MyReact DOM stream       | SSR fallback 文案仍偏硬编码                       |
| Fiber `__serverComponent__` |      —      | ◐ 位存在但未走 client reconciler | Flight 旁路；符合设计但与早期 openspec 不完全一致 |
| Next / Remix / Rspack RSC   |      —      |                ❌                | 仅 Vite                                           |

---

## 4. 我们做了什么（已具备）

1. **三环境 Vite 流水线**：scan → RSC build → client build → SSR build（`packages/myreact-vite/src/rsc/`）。
2. **指令变换**：`"use client"` / `"use server"`（含内联 hoist）。
3. **Flight 往返**：`@my-react/react-server` 封装 encode/decode、client hydrate、server action HTTP。
4. **Dev 体验骨架**：HTML SSR middleware、`/__rsc`、`/__rsc_action`、bootstrap 注入。
5. **端到端示例**：`ui/rsc-example`（async SC、client widgets、server actions、客户端再拉 Flight）。
6. **OpenSpec 设计基线**：`openspec/changes/implement-rsc/*`。

---

## 5. 我们没做什么 / 明显落后（按优先级）

### P0 — 正确性与 DX 基线

| ID   | 差距                                | 说明                                                                                                                                   |
| ---- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| P0-1 | **Server Component HMR**            | **done（Phase 1）**：`rsc` `hotUpdate` → `rsc:update` → browser 重拉 `/__rsc` + `setTree`；CC 仍走 React Refresh。Phase 2 局部子树未做 |
| P0-2 | **Flight 协议对拍 / hydration e2e** | 依赖 `@lazarv/rsc` vs `react-server-dom`；缺 Playwright 级回归                                                                         |
| P0-3 | **文档与 API 一致性**               | README `react({ rsc: true })` vs 真实 `import { rsc } from '@my-react/react-vite/rsc'`                                                 |

**SC HMR 实现草图**

1. **Phase 0**：`rsc`/`ssr` 图上 SC 文件 `hot.update` → `server.ws.send({ type: 'full-reload' })`。正确但粗暴（未采用）。
2. **Phase 1（已落地）**：SC 变更时 `environments.rsc` invalidate → `client.hot.send({ event: 'rsc:update' })` → browser `GET /__rsc?url=location` → `setTree`（`entry.browser`）。CC HMR 继续走 React Refresh；CC update 时同步 invalidate RSC 上同模块 proxy。
3. **Phase 2**：边界级刷新（只重拉变更 SC 子树），需 Flight 局部更新协议，成本高。

### P1 — 与官方 bundler 原语对齐

| ID   | 差距                                                    | 说明                                          |
| ---- | ------------------------------------------------------- | --------------------------------------------- |
| P1-1 | `server-only` / `client-only` validateImports           | **done**（A14）                               |
| P1-2 | Temporary references + **action 闭包加密**              | 安全与完整 server function 语义               |
| P1-3 | `prerender` / static RSC                                | SSG 入口                                      |
| P1-4 | RSC CSS 自动注入（`loadCss` / rscCssTransform）         | SC 样式正确性                                 |
| P1-5 | `decodeFormState` / form progressive enhancement 全路径 |                                               |
| P1-6 | 生产态「不依赖 Vite middleware」的 runner               | **done**（A15：handler + 纯 Node server.mjs） |
| P1-7 | CJS / transitive client-in-server 用例矩阵              | 对齐 `examples/basic/test-dep`                |

### P2 — 进阶场景

| ID   | 差距                                            |
| ---- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| P2-1 | `"use cache"` / cache callable transforms       |
| P2-2 | no-ssr / client-first                           | **partial**：`ui/rsc-example` 设 `RSC_SSR=0`（或 `pnpm dev:no-ssr` / `build:no-ssr`）走 shell+Flight、无 `ssr` env；client-first 仍未做 |
| P2-3 | PPR / SSG 示例                                  |
| P2-4 | `loadModuleDevProxy`、自定义 environment runner |
| P2-5 | `onClientReference` 扩展                        |
| P2-6 | 自定义 server-function directive claims         |

### P3 — 生态

| ID   | 差距                             |
| ---- | -------------------------------- |
| P3-1 | React Router / 其他框架集成示例  |
| P3-2 | browser-mode（双环境跑在浏览器） |
| P3-3 | Rspack / 非 Vite 宿主            |

---

## 6. 底层差异（实现细节）

### 6.1 Flight 实现栈

|              | Official                                  | MyReact                                                                                     |
| ------------ | ----------------------------------------- | ------------------------------------------------------------------------------------------- |
| 协议实现     | Meta `react-server-dom-*`                 | `@lazarv/rsc`（experimental pin）                                                           |
| 模块加载约定 | webpack-style manifest + Vite 生成 loader | 自建 `module-loader` / manifest helpers                                                     |
| 树归一化     | React 内部                                | `normalize-rsc.ts`（`$L…`、lazarv lazy→MyReact lazy、Promise）；裸 `$L\d+` Suspense pending |

**风险**：任何 React canary Flight 变更，官方插件跟 `react-server-dom`；MyReact 跟 `@lazarv/rsc` 节奏，可能出现 **payload 不完全互通**。

### 6.2 插件职责边界

- **官方**：尽量只做 bundler 原语 + 薄 runtime re-export；框架（Router / cache / PPR）用 examples 演示。
- **MyReact**：插件 + `@my-react/react-server` + DOM SSR **绑在一起**，更「开箱示例」，但扩展面（加密、CSS、HMR、多 runtime）尚未铺到官方深度。

### 6.3 Reconciler

- MyReact 早期 openspec 规划 `__serverComponent__` 进 client reconciler；实际采用 **Flight 旁路**（task 11.x deferred）。这与官方一致（SC 不在浏览器 reconciler 执行），但共享包里的 fiber bit 目前基本闲置。

### 6.4 依赖与版本

- Official peer：`react` / `react-dom` / optional `react-server-dom-webpack` / `vite`
- MyReact：`@lazarv/rsc` + `@my-react/react` + `@my-react/react-reconciler`；Vite peer `^4.2 || ^5 || ^6 || ^7`

---

## 7. 包与入口速查

### Official（`@vitejs/plugin-rsc`）

| 入口                                      | 用途                     |
| ----------------------------------------- | ------------------------ |
| `.`                                       | 插件工厂                 |
| `/rsc/server` `/rsc/client` `/rsc/static` | RSC 环境 runtime         |
| `/ssr`                                    | SSR 环境 Flight client   |
| `/browser`                                | 浏览器 Flight client     |
| `/react/*`                                | 低层 loader / 生成代码用 |
| `/transforms`                             | 可复用变换               |

### MyReact

| 包 / 入口                       | 用途                            |
| ------------------------------- | ------------------------------- |
| `@my-react/react-vite/rsc`      | Vite 插件 `rsc()`               |
| `@my-react/react-server`        | 符号 / 类型                     |
| `@my-react/react-server/server` | Flight server + actions         |
| `@my-react/react-server/client` | Flight client + module loader   |
| `@my-react/react-dom/server`    | HTML streaming                  |
| `ui/rsc-example`                | 唯一完整 demo（`pnpm dev:rsc`） |

---

## 8. 建议推进顺序（可勾选）

- [ ] **P0-3** 修正根 README / 站点文案：统一为 `@my-react/react-vite/rsc` 的 `rsc()` API
- [ ] **P0-2** 建立最小 Playwright：SSR HTML 含 payload → hydrate → 点 server action
- [ ] **P0-1** 调研官方 SC HMR 机制，落地 MyReact 版（可先全页 reload 策略 + 边界刷新）
- [ ] **P1-1** `server-only` / `client-only` validate
- [ ] **P1-2 / P1-4** 闭包加密 + RSC CSS
- [ ] **P1-7** 移植官方 `examples/basic` 中的 dep 边界用例到 `ui/rsc-example` 或独立 fixture
- [ ] 评估长期是否 **贴近 `react-server-dom`**（弃用或双栈 `@lazarv/rsc`）——架构级决策，影响所有 P1 Flight 对拍

---

## 9. 刷新对照基线

```bash
git -C tmp/vite-plugin-react pull --ff-only origin main
# 记录: packages/plugin-rsc/package.json version + git rev-parse --short HEAD
# 更新本文档顶部「基线」行
```

官方文档入口：

- 仓库：[vitejs/vite-plugin-react](https://github.com/vitejs/vite-plugin-react/tree/main)
- 包说明：[`packages/plugin-rsc/README.md`](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-rsc/README.md)

---

## 10. 变更日志（本文档）

| 日期       | 变更                                                                          |
| ---------- | ----------------------------------------------------------------------------- |
| 2026-07-31 | 初版：对照 `@vitejs/plugin-rsc@0.5.32` 与 MyReact RSC 现状，建立 P0–P3 追踪表 |
