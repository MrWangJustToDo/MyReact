import type { Configuration } from "webpack";

export type ENV = {
  DEV_HOST?: string;
  DEV_PORT?: string;
  WDS_PORT?: string;
  PROD_HOST?: string;
  PROD_PORT?: string;
};

export type BaseGenerateActionProps = {
  env: "client" | "server";
  entry: string;
  isDEV?: boolean;
};

export type SafeGenerateActionProps = Required<BaseGenerateActionProps> & Required<ENV>;

export type DefineWebpackConfigProps = {
  serverEntry: string;
  clientEntry: string;
  webpackServer?: (props: Required<Omit<BaseGenerateActionProps, "env" | "clientEntry">>) => Partial<Configuration>;
  webpackClient?: (props: Required<Omit<BaseGenerateActionProps, "env" | "serverEntry">>) => Partial<Configuration>;
} & ENV;
