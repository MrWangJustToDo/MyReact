// Browser shim for Node.js 'os' module

export const EOL = "\n";

export default {
  EOL,
  platform: () => "browser",
  release: () => "",
  tmpdir: () => "/tmp",
  homedir: () => "/",
  hostname: () => "localhost",
  type: () => "Browser",
  arch: () => "x64",
  endianness: () => "LE" as const,
  freemem: () => 0,
  totalmem: () => 0,
  cpus: () => [],
  networkInterfaces: () => ({}),
  uptime: () => 0,
  loadavg: () => [0, 0, 0] as [number, number, number],
};
