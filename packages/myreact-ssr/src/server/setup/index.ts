import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import session from "express-session";

import type { Express } from "express";

const setUp = (expressApp: Express) => {
  expressApp.use(express.static(`${process.cwd()}/static`));

  expressApp.use(express.static(`${process.cwd()}/lang`));

  expressApp.use(express.static(`${process.cwd()}/dist`));

  expressApp.use(cookieParser());

  expressApp.use(express.json({ limit: "5mb" }));

  expressApp.use(express.urlencoded({ extended: true }));

  expressApp.use(
    cors({
      maxAge: 86400,
      origin: "*",
    })
  );

  expressApp.use(
    session({
      secret: "keyboard cat",
      resave: true,
      rolling: true,
      saveUninitialized: true,
      cookie: { maxAge: 600000 },
      name: "react-ssr",
    })
  );
};

export { setUp };
