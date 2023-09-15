import type { Configuration } from "webpack";

export type ENV = {
  DEV_HOST?: string;
  DEV_PORT?: string;
  WDS_PORT?: string;
  PROD_HOST?: string;
  PROD_PORT?: string;
  BUNDLE_SCOPE?: string;
  OUTPUT_SCOPE?: string;
};

export type CHECK = {
  TS_CHECK?: boolean;
  ESLINT_CHECK?: boolean;
  BUNDLE_CHECK?: boolean;
};

type SIDE = "client" | "server";

export type BaseGenerateActionProps = {
  env: SIDE;
  entry: string;
  isDEV?: boolean;
  isMIDDLEWARE?: boolean;
};

export type SafeGenerateActionProps = Required<BaseGenerateActionProps> & Required<ENV> & CHECK;

export type DefineUniversalWebpackConfigProps = {
  serverEntry: string;
  clientEntry: string;
  isDEV?: boolean;
  isMIDDLEWARE?: boolean;
  webpackServer?: (props: SafeGenerateActionProps) => Partial<Configuration>;
  webpackClient?: (props: SafeGenerateActionProps) => Partial<Configuration>;
} & ENV &
  CHECK;

export type SafeDefineUniversalWebpackConfigProps = Omit<SafeGenerateActionProps, "env" | "entry"> &
  Pick<DefineUniversalWebpackConfigProps, "serverEntry" | "clientEntry" | "webpackServer" | "webpackClient">;
