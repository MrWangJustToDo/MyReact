import { Helmet } from "react-helmet-async";

import { useLang } from "hooks/useLang";
import { supportedLangs } from "utils/i18n";

import style from "./index.module.scss";

export const Header = () => {
  const { changeLang, lang } = useLang();
  return (
    <header className={style.header}>
      <Helmet defaultTitle="React SSR Starter – TypeScript Edition" titleTemplate="%s – React SSR Starter – TypeScript Edition" />
      <div>
        当前 {lang}, 可用 {Object.keys(supportedLangs).join(" ")}
        {Object.keys(supportedLangs).map((code) => (
          <button key={code} onClick={() => changeLang(code)}>
            {supportedLangs[code as unknown as "en" | "ar"]}
          </button>
        ))}
      </div>
    </header>
  );
};
