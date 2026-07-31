# MyReact RSC — 已实现路径审计（漏洞 / 错误）

> **范围**：当前已落地的 `@my-react/react-server` + `@my-react/react-vite/rsc` + `ui/rsc-example`  
> **对照**：能力差距见 [`RSC.md`](./RSC.md)；本文只记「已实现代码里的问题」  
> **日期**：2026-07-31  
> **方法**：源码审查（非渗透测试）；未跑 Playwright 回归

图例：

| 级别 | 含义 |
| --- | --- |
| Critical | 可直接导致任意代码执行 / 任意模块加载 |
| High | 可绕过安全边界、伪造敏感参数、跨站触发 mutation |
| Medium | 正确性破坏、可利用的混淆、信息泄露或拒绝服务 |
| Low | 边缘 case、脆弱假设、质量问题 |
| Info | 设计债 / 与官方差距（已知），需知悉风险 |

---

## 摘要

源码审查（含二次交叉核对）。**已修复：A1、A2、A4、A5、A7–A10（部分）、A14–A20**。A6 保持现状。仍开放：**A3** 及低优先级项。

| # | 级别 | 标题 | 状态 |
| --- | --- | --- | --- |
| A1 | Critical | `/__rsc?component=` 任意 `ssrLoadModule` | **fixed** (2026-07-31) → 仅 `renderRsc(url)` |
| A2 | High | Server Action 无 Origin / CSRF 防护 | **fixed** (2026-07-31) → `assertSameOriginActionRequest` |
| A3 | High | 内联 `"use server"` 闭包绑定明文 `.bind`（无加密） | open |
| A4 | High | FormData `decodeAction` 与 Header actionId 可不一致 | **fixed** (2026-07-31) → FormData id 必须匹配 Header |
| A5 | Medium | `onError` / 404 把内部错误与 actionId 回给客户端 | **fixed** (2026-07-31) → opaque digest；A6 保持现状 |
| A6 | Medium | 未解析 `$L…` Flight 引用被静默变成 `() => null` | **wontfix** — 保持现状 |
| A7 | Medium | `createServerActionReference` 未走 `createServerReference` | **fixed** (2026-07-31) |
| A8 | Medium | 文件级 `"use server"` 未强制 async（`rejectNonAsyncFunction: false`） | **fixed** (2026-07-31) |
| A9 | Medium | `transform-hoist-inline` 静默删除 `export *` / re-export | **fixed** (2026-07-31) → 编译报错 |
| A10 | Medium | 请求体无大小限制（DoS） | **partial** — `/__rsc` 64KB；action 4MB |
| A11 | Low | Action ID 可预测 + 404 枚举 | open（404 文案已脱敏） |
| A12 | Low | SSR 仅精确替换 `<div id="root"></div>` | open |
| A13 | Low | `hashActionId` / `referenceKey` 32-bit 哈希碰撞 | open |
| A14 | Info | `validateImports` 仅有类型字段、未实现 | **fixed** (2026-07-31) → `createValidateImportsPlugin`，默认开启 |
| A15 | Info |「生产」`server.mjs` 仍起 Vite，复用 middleware 风险面 | **fixed** (2026-07-31) → 纯 Node `import(dist/rsc)` + 静态 `dist/client`；entry 导出 `handler(Request)` |
| A16 | High | `/__rsc_action` 未预加载 `server-actions-init`，registry 竞态 | **fixed** (2026-07-31) |
| A17 | High | `conditions-plugin` 全局注入 `react-server`（污染 client/ssr） | **fixed** (2026-07-31) → 仅 `rsc` env + `runner.import` |
| A18 | Medium | 公开 `?rsc-original` 可跳过全部 RSC transform | **fixed** (2026-07-31) → 内部 query + 仅 SSR |
| A19 | Medium | 默认 `module-loader` 信任 Flight `metadata.id` 动态 import | **fixed** (2026-07-31) → 协议拒绝 + manifest 门禁 |
| A20 | Medium | `use*` 启发式误伤合法服务端助手函数 | **fixed** (2026-07-31) → 仅已知 hooks 白名单 |
| A21 | Low | `server.mjs` `path.join(CLIENT_DIR, pathname)` 绝对路径拼接失效 | **fixed** (2026-07-31) → 前缀校验 + 相对路径 |
| A22 | Low | HTML middleware 过宽（凡 `Accept: text/html` 的 GET 都走 RSC SSR） | open |

---

## Critical / High

### A1 — `/__rsc?component=` 任意模块加载 — **FIXED**

**原问题**：`component` 查询参数直接 `ssrLoadModule`，可任意执行项目模块。

**修复（2026-07-31）**：

- `/__rsc` 只调用配置的 `entryRsc.renderRsc(pageUrl)`
- `pageUrl` 来自 `?url=` 或 POST `{ url }`，且必须同源 http(s) 或绝对路径 `/…`
- 不再接受 `component`；未配置 `entries.rsc` 时返回 503
- Client 导航改为 `GET /__rsc?url=…`（见 `ui/rsc-example/src/entry-client.tsx`）

---

### A2 — Server Action 无 Origin / CSRF 防护 — **FIXED**

**修复（2026-07-31）**：

- `assertSameOriginActionRequest`：拒绝 `Sec-Fetch-Site: cross-site`；校验 `Origin`/`Referer` 与 `Host` 一致；二者皆缺则 403
- `handleServerAction` 默认启用（`requireSameOrigin: false` 仅供受信测试）
- Client `callServer` 使用 `credentials: "same-origin"`

---

### A3 — 闭包绑定明文 `.bind`（无加密）

**位置**：

- [`transform-hoist-inline.ts`](../myreact-vite/src/rsc/transforms/transform-hoist-inline.ts) L121–123：无 `encode` 时 `bind(null, bindVars…)`
- [`transform-plugin.ts`](../myreact-vite/src/rsc/plugins/transform-plugin.ts) 调用 `transformServerActionServer` **未传入** `encode`/`decode`

**问题**：内联 `"use server"` 捕获的闭包变量会以明文进入 Flight / `.bind` 参数。攻击者可改 bound args 再调同一 actionId（官方用 encryption key 防篡改）。

**影响**：一旦业务写 `async function (id) { "use server"; await delete(id) }` 且 id 来自闭包，即可伪造 id。

**修复方向**：实现与官方类似的 `defineEncryptionKey` + encode/decode；未加密前文档明确 **禁止信任闭包绑定做鉴权**。

---

## Medium

### A4 — FormData 与 Header actionId 不一致 — **FIXED**

**修复（2026-07-31）**：`extractActionIdFromFormData` 解析 `$ACTION_ID_*` / `$ACTION_REF_*`；若与 Header 不一致则抛 `ServerActionDecodeError`。404 响应不再回显具体 actionId。

---

### A5 — 错误 / digest 信息泄露 — **FIXED**

**修复（2026-07-31）**：

- `createClientErrorDigest` / `createPublicErrorMessage`：生产返回不透明 id，详情只打日志；`__DEV__` 仍回 message
- `renderToFlightStream` 默认 onError、`handleServerAction` 500、dev-server catch 使用脱敏文案
- 404 已不回显 actionId

---

### A6 — 未解析 `$L…` 静默变 `null` 组件 — **WONTFIX（保持现状）**

按产品决定暂不改为抛错；DEV 仍 `console.warn`，运行时 `() => null`。

---

### A7 — Client 侧 Server Action 引用实现不一致 — **FIXED**

**修复（2026-07-31）**：`createServerActionReference` 改为调用 `@lazarv/rsc` 的 `createServerReference`（惰性 callServer）。

---

### A8 — 文件级 `"use server"` 允许非 async — **FIXED**

**修复（2026-07-31）**：scan / server wrap / client proxy 均 `rejectNonAsyncFunction: true`。

---

### A9 — Hoist 变换静默丢掉 `export *` / 纯 re-export — **FIXED**

**修复（2026-07-31）**：与 wrap-export 一致，遇到 `export *` / 纯 re-export 时编译抛错。

---

### A10 — 请求体无大小限制 — **PARTIAL**

**修复（2026-07-31）**：`/__rsc` POST 限 64KB；`/__rsc_action` 限 4MB。超出 413。

---

## Low / Info

### A11 — Action ID 可预测

ID = `` `${moduleId}#${name}` ``（常含源文件路径）。便于枚举（配合 A2）。可用稳定 hash 对外 id（仍须 registry 映射），但不能替代 CSRF/鉴权。

### A12 — HTML 注入依赖精确 DOM

`html.replace('<div id="root"></div>', …)`：模板稍改即 SSR 内容不进页，client 仍可能 hydrate 异常。

### A13 — `hashActionId` 为简易字符串哈希

碰撞时 `getByReferenceKey` 返回第一个。若将来用 referenceKey 做路由，会点错 action。应用加密安全的 hash，并检测碰撞。

### A14 / A15

- **A14 fixed**：`rsc({ validateImports })` 默认 true；非法边解析到 virtual invalid 模块并在 DEV transform / BUILD buildEnd 抛出带 import chain 的错误。
- **A15 fixed**：example `entry.rsc` 默认导出 `handler(Request)`；dev middleware 仅 Connect→Request→handler；`server.mjs` 纯 Node `import(dist/rsc)` + 静态 `dist/client`（无 Vite）。`rsc({ serverHandler: false })` 可关闭默认 middleware。

---

## 二次审查补充（A16–A22）

### A16 — Action registry 未在端点预热 — **FIXED**

**修复（2026-07-31）**：`/__rsc_action` 在 `handleServerAction` 前 `importFromEnvironment(server, "rsc", virtual:my-react-rsc/server-actions-init)`；`handleServerAction` 本身也从 `rsc` env 加载，与注册侧同图。

---

### A17 — 全局 `react-server` resolve condition — **FIXED**

**修复（2026-07-31）**：

- `conditions-plugin` 改为 `configEnvironment("rsc")` 仅注入
- HTML/`/__rsc`/`action` 经 `importFromEnvironment`（当前 DEV 为 `ssrLoadModule`，避 CJS `module is not defined`）

---

### A18 — `?rsc-original` 跳过全部 transform — **FIXED**

**修复（2026-07-31）**：

- 查询改为内部名 `__my_react_rsc_ssr_original`（`withRscSsrOriginalQuery`）
- 仅当环境为 SSR（或无 env 名且 ssrFlag）时才跳过 transform；client 伪造 query 无效

---

### A19 — 默认 module loader 信任 `metadata.id` — **FIXED**

**修复（2026-07-31）**：

- `assertSafeClientModuleId`：拒绝 `http(s):` / `data:` / `blob:` / `file:` / `node:` / `//`
- `createManifestModuleLoader`：默认要求 manifest 命中
- 无 entry 且禁止动态 import 时抛错

---

### A20 — `use*` 启发式误报 — **FIXED**

**修复（2026-07-31）**：仅拦截已知 React hooks 集合，不再 `name.startsWith("use")`。

---

### A21 — `server.mjs` 静态资源 path.join

**位置**：`ui/rsc-example/server.mjs`：`path.join(CLIENT_DIR, pathname)` 且 `pathname` 以 `/` 开头时在 POSIX 上丢掉 `CLIENT_DIR`

**影响**：自定义 asset middleware 可能从未真正命中；若日后「naive 修复」不做 `resolve`+前缀校验，易引入路径穿越。

---

### A22 — HTML SSR middleware 过宽

**位置**：dev-server HTML 分支：几乎所有 `Accept: text/html` 的 GET 都进 RSC/SSR

**影响**：其它路由/工具请求被意外吃掉或拖慢。

---

## 相对「看起来正常」的点

| 项 | 说明 |
| --- | --- |
| Guestbook 文本渲染 | `{message.text}` 走 React 文本子节点，非 `dangerouslySetInnerHTML`，存储型 XSS 风险低 |
| Action 必须先 registry | `getServerAction` 未命中则 404，不能直接调任意函数名（但仍可调**所有已注册** action；且见 A16 冷启动） |
| `registerServerReference` 双写 | 同时写入 `@lazarv/rsc` 与本地 `serverActionRegistry`，方向正确 |
| HTML SSR 主路径 | `entryRsc.renderRsc` + tee + `injectRSCPayload` 结构合理；`/__rsc` 已与之对齐（A1） |

---

## 建议修复顺序（可勾选）

- [x] **A1** 去掉任意 `component` 加载；client 导航改为 `renderRsc`/`?url=` 同源校验
- [x] **A2** Action 端点加 Origin/Host 校验（至少默认开启）
- [x] **A16** action 处理前预热 `server-actions-init`
- [x] **A17** `react-server` condition 仅限 rsc env（DEV 加载暂用 `ssrLoadModule` 避 CJS）
- [x] **A4** FormData/Header action id 一致
- [x] **A10**（部分）`/__rsc` 64KB + action 4MB body 限制
- [x] **A5** 生产错误响应与 digest 脱敏
- [x] **A7** 统一 `createServerReference`
- [x] **A8 / A9** transform 与 React 约定对齐（async + export* 报错）
- [~] **A6** 未解析引用 — 保持现状（wontfix）
- [x] **A18 / A19** 收紧 `rsc-original` 与 module loader
- [x] **A20** `use*` 启发式白名单
- [x] **A14** `validateImports`（server-only / client-only）
- [x] **A15** 生产纯 Node runner（handler + `import(dist/rsc)`）
- [ ] **A3** 加密闭包（对齐官方）
- [ ] **A11–A13 / A22** 低优先级 DX
- [ ] 为关键路径补最小回归测试或手工 checklist

---

## 变更日志

| 日期 | 变更 |
| --- | --- |
| 2026-07-31 | 初版审计：A1–A15 |
| 2026-07-31 | **A1 fixed**：`/__rsc` → `renderRsc(url)` + 同源 URL；example client 改 `?url=` |
| 2026-07-31 | 合并二次审查：A4 升为 High；新增 A16–A22 |
| 2026-07-31 | **A2/A4/A16/A17 fixed**；A10 partial；action 404 脱敏 |
| 2026-07-31 | **A5/A7/A8/A9 fixed**；A6 wontfix 保持现状 |
| 2026-07-31 | **A18/A19/A20 fixed** |
| 2026-07-31 | **A14 fixed**：`validateImports` 插件默认开启 |
| 2026-07-31 | **A15/A21 fixed**：handler(Request) + 纯 Node prod server；example `src/framework/` |
