/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */

interface LoadRemoteScriptOptions {
  timeout?: number;
  context?: Record<string, any>;
  useEval?: boolean;
}

async function loadRemoteScript(url: string, options: LoadRemoteScriptOptions = {}): Promise<void> {
  const { timeout = 10000, context = {}, useEval = false } = options;

  try {
    // 使用 AbortController 支持超时（浏览器和现代 Node.js/Bun）
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const code = await response.text();
    clearTimeout(timeoutId);

    // 根据环境选择执行方式
    await executeScript(code, url, { context, useEval });
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error(`加载远程脚本超时 (${timeout}ms)`);
    }
    throw new Error(`加载远程脚本失败: ${error.message}`);
  }
}

async function executeScript(code: string, url: string, options: { context?: Record<string, any>; useEval?: boolean }): Promise<void> {
  const { context = {}, useEval = false } = options;

  // 环境检测
  const env = detectEnvironment();

  switch (env) {
    case "bun":
      await executeInBun(code, url, context);
      break;

    case "node":
      await executeInNode(code, url, context);
      break;

    case "browser":
      await executeInBrowser(code, url, context, useEval);
      break;

    default:
      throw new Error("未知的 JavaScript 环境");
  }
}

function detectEnvironment(): "bun" | "node" | "browser" {
  // 检测 Bun
  // @ts-ignore
  if (typeof Bun !== "undefined" && Bun.version) {
    return "bun";
  }

  // 检测 Node.js
  if (typeof process !== "undefined" && process.versions && process.versions.node) {
    return "node";
  }

  // 检测浏览器环境
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    return "browser";
  }

  // 默认为浏览器环境（保守策略）
  return "browser";
}

// Bun 环境执行
async function executeInBun(code: string, url: string, context: Record<string, any>): Promise<void> {
  try {
    // 方法1: 使用 data URL import (推荐)
    const dataUrl = `data:application/javascript;base64,${btoa(unescape(encodeURIComponent(code)))}`;
    await import(dataUrl);
    return;
  } catch (error) {
    // 方法2: 使用 Bun 的运行时执行
    // @ts-ignore
    if (typeof Bun !== "undefined") {
      try {
        // Bun 可以直接运行代码字符串
        // @ts-ignore
        Bun.$`echo ${code} | bun run -`;
        return;
      } catch (bunError) {
        console.warn("Bun 直接执行失败:", bunError);
      }
    }

    // 方法3: 使用 VM 回退
    await executeWithVM(code, url, context);
  }
}

// Node.js 环境执行
async function executeInNode(code: string, url: string, context: Record<string, any>): Promise<void> {
  try {
    // 方法1: 使用 VM 模块
    await executeWithVM(code, url, context);
  } catch (error: any) {
    // 方法2: 使用 data URL import (Node.js 17+)
    try {
      const dataUrl = `data:application/javascript;base64,${Buffer.from(code).toString("base64")}`;
      await import(dataUrl);
    } catch (importError: any) {
      throw new Error(`Node.js 执行失败: ${error.message} ${importError.message}`);
    }
  }
}

// 浏览器环境执行
async function executeInBrowser(code: string, url: string, context: Record<string, any>, useEval: boolean): Promise<void> {
  // 浏览器环境的安全考虑
  if (!useEval && isPotentiallyUnsafe(code)) {
    throw new Error("代码包含潜在不安全内容，如需执行请设置 useEval: true");
  }

  try {
    // 方法1: 使用 script 标签插入 (最安全)
    await executeWithScriptTag(code, url);
  } catch (error) {
    // 方法2: 使用 eval (需要显式启用)
    if (useEval) {
      executeWithEval(code, context);
    } else {
      throw new Error("浏览器执行失败，请启用 useEval 选项或检查 CSP 设置");
    }
  }
}

// 通用 VM 执行 (Node.js/Bun)
async function executeWithVM(code: string, url: string, context: Record<string, any>): Promise<void> {
  try {
    const vm = await import("vm");

    const sandbox = {
      // 基础全局变量
      console,
      setTimeout,
      setInterval,
      clearTimeout,
      clearInterval,
      URL,
      URLSearchParams,
      // 环境特定全局变量
      ...(typeof global !== "undefined" ? { global } : {}),
      ...(typeof window !== "undefined" ? { window } : {}),
      ...(typeof process !== "undefined" ? { process } : {}),
      // 用户自定义上下文
      ...context,
    };

    // 创建上下文
    const vmContext = vm.createContext(sandbox);

    // 执行代码
    const script = new vm.Script(code, {
      filename: url,
      lineOffset: 0,
      columnOffset: 0,
    });

    script.runInContext(vmContext);
  } catch (error) {
    throw new Error(`VM 执行失败: ${error}`);
  }
}

// 浏览器 script 标签执行
function executeWithScriptTag(code: string, url: string): Promise<void> {
  // 检查是否在浏览器环境
  if (typeof document === "undefined") {
    throw new Error("document 未定义，不在浏览器环境中");
  }

  return new Promise((resolve, reject) => {
    // 创建 script 元素
    const script = document.createElement("script");

    // 使用 Blob URL 避免 CSP 问题
    const blob = new Blob([code], { type: "application/javascript" });
    const blobUrl = URL.createObjectURL(blob);
    script.src = blobUrl;

    // 设置错误处理
    script.onerror = () => {
      URL.revokeObjectURL(blobUrl);
      reject(new Error("Script 标签加载失败"));
    };

    script.onload = () => {
      URL.revokeObjectURL(blobUrl);
      resolve();
    };

    // 添加到 DOM
    document.head.appendChild(script);
  });
}

// 浏览器 eval 执行
function executeWithEval(code: string, context: Record<string, any>): void {
  // 在特定上下文中执行
  const contextKeys = Object.keys(context);
  const contextValues = Object.values(context);

  try {
    // 使用 Function 构造函数比直接 eval 稍安全
    const func = new Function(
      ...contextKeys,
      `
      "use strict";
      ${code}
    `
    );

    func(...contextValues);
  } catch (error) {
    // 回退到间接 eval
    try {
      const indirectEval = eval;
      indirectEval(code);
    } catch (evalError) {
      throw new Error(`Eval 执行失败: ${evalError}`);
    }
  }
}

// 简单的安全检查
function isPotentiallyUnsafe(code: string): boolean {
  const unsafePatterns = [
    /document\.cookie/i,
    /localStorage/i,
    /sessionStorage/i,
    /eval\s*\(/i,
    /Function\s*\(/i,
    /script\.src/i,
    /innerHTML/i,
    /outerHTML/i,
    /document\.write/i,
  ];

  return unsafePatterns.some((pattern) => pattern.test(code));
}

// 安全的 require 函数模拟
function createSafeRequire() {
  if (typeof require !== "undefined") {
    return require;
  }

  // 在浏览器环境中返回一个安全的模拟 require
  return (id: string) => {
    throw new Error(`require('${id}') 在浏览器环境中不可用`);
  };
}

// 增强的模块加载版本（支持导出）
export async function loadRemoteModule<T = any>(url: string, options: LoadRemoteScriptOptions = {}): Promise<T> {
  const { context = {} } = options;

  // 创建模块导出对象
  const moduleExports = {};
  const moduleContext = {
    exports: moduleExports,
    module: { exports: moduleExports },
    require: createSafeRequire(), // 安全的 require 函数
    ...context,
  };

  await loadRemoteScript(url, {
    ...options,
    context: moduleContext,
  });

  return moduleContext.module.exports as T;
}
