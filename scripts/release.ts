import { readFile } from "fs/promises";
import { spawn } from "node:child_process";
import { resolve } from "path";

const pkgNameAlias = {
  "@my-react/react": "myreact",
  "@my-react/react-dom": "myreact-dom",
  "@my-react/react-jsx": "myreact-jsx",
  "@my-react/react-reactive": "myreact-reactivity",
  "@my-react/react-reconciler": "myreact-reconciler",
  "@my-react/react-refresh": "myreact-refresh",
  "@my-react/react-shared": "myreact-shared",
  "@my-react/react-refresh-tools": "myreact-refresh-tools",
  "@my-react/react-vite": "myreact-vite",
};

const getVersion = (pkgName: string) =>
  new Promise((a, b) => {
    const ls = spawn(`pnpm view ${pkgName} version --json`, { shell: true, stdio: "pipe" });
    ls.stdout.on("data", (d) => {
      const res = Buffer.from(d).toString("utf-8");
      a(JSON.parse(res));
    });
    ls.on("error", (e) => b(e));
  });

const publish = (pnkName: string, cwd: string) => {
  return new Promise((a, b) => {
    const ls = spawn(`pnpm publish --access public`, { shell: true, stdio: "inherit", cwd });
    ls.on("close", () => {
      a(true);
    });
    ls.on("error", (e) => b(e));
  });
};

const release = async (pkgName: keyof typeof pkgNameAlias) => {
  if (!pkgNameAlias[pkgName]) return;
  const path = "packages/" + pkgNameAlias[pkgName];

  const packagesFile = resolve(process.cwd(), path, "package.json");

  const data = await readFile(packagesFile, { encoding: "utf-8" });

  const pkgObj = JSON.parse(data);

  const version = pkgObj.version;

  try {
    const cVersion = await getVersion(pkgName);

    if (cVersion === version) {
      console.log(`no need release ${pkgName} @${version}`);
      return;
    } else {
      console.log(`new version: ${version} of ${pkgName} will release, current is: ${cVersion}`);
    }

    await publish(pkgName, resolve(process.cwd(), path));

    console.log(`success release ${pkgName} @${version}`);
  } catch (e) {
    console.log(e);
  }
};

release("@my-react/react");
release("@my-react/react-dom");
release("@my-react/react-jsx");
release("@my-react/react-reactive");
release("@my-react/react-reconciler");
release("@my-react/react-refresh");
release("@my-react/react-shared");
release("@my-react/react-refresh-tools");
release("@my-react/react-vite");
