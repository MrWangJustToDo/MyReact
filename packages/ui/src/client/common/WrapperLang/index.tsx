import { useEffect, useRef } from "react";
import { IntlProvider } from "react-intl";

import { defaultLang, useAppSelector } from "@shared";

import type { ReactNode } from "react";

export const WrapperLang = ({ children }: { children: ReactNode }) => {
  const htmlRef = useRef<HTMLHtmlElement | null>(null);

  const data = useAppSelector((state) => state.server.serverLang.data);
  const lang = useAppSelector((state) => state.client.clientLang.data);

  useEffect(() => {
    if (!htmlRef.current) {
      htmlRef.current = document.querySelector("html");
    }
    if (htmlRef.current) {
      htmlRef.current.lang = lang;
    }
  }, [lang]);

  return (
    <IntlProvider locale={lang} messages={data[lang] || {}} defaultLocale={defaultLang}>
      {children}
    </IntlProvider>
  );
};
