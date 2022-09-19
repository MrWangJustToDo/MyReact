import type { Configuration } from "webpack";

export type ENV = {
  DEV_HOST?: string;
  DEV_PORT?: string;
  WDS_PORT?: string;
  PROD_HOST?: string;
  PROD_PORT?: string;
};

export type BaseGenerateActionProps = {
  ui: "antd" | "chakra";
  env: "client" | "server";
  entry: string;
  isDEV?: boolean;
  isSSR?: boolean;
  isCSR?: boolean;
  isMIDDLEWARE?: boolean;
};

export type SafeGenerateActionProps = Required<BaseGenerateActionProps> & Required<ENV>;

export type DefineWebpackConfigProps = {
  serverEntry: string;
  clientEntry: string;
  isSSR?: boolean;
  isCSR?: boolean;
  webpackServer?: (props: Required<Omit<BaseGenerateActionProps, "env" | "clientEntry">>) => Partial<Configuration>;
  webpackClient?: (props: Required<Omit<BaseGenerateActionProps, "env" | "serverEntry">>) => Partial<Configuration>;
} & ENV;
