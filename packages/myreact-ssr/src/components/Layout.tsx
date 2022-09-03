import { Outlet } from "react-router";

import { Footer } from "./Footer";
import { Header } from "./Header";
import style from "./index.module.scss";

import type { PreLoadComponentType } from "types/components";

export const Layout: PreLoadComponentType = () => {
  return (
    <div className={style.container}>
      <Header />
      <div>header ---- body</div>
      <main className={style.content}>
        <Outlet />
        <hr />
      </main>
      <div>body ----- footer</div>
      <Footer />
    </div>
  );
};
