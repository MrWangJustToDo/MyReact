/**
 * React module wrapper for Turbopack
 * This file automatically injects the refresh runtime when imported
 */

// Inject refresh runtime in development mode (client-side only)
if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  require("@my-react/react-refresh-tools/runtime");
}

// Re-export all React exports
module.exports = require("@my-react/react");
