export interface RootState {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  children: Instance[];
  dpr: number;
  frames: number;
  invalidate: () => void;
}

export interface BaseShapeProps {
  color?: string;
  onClick?: () => void;
  x: number;
  y: number;
}

export interface RectProps extends BaseShapeProps {
  type: "rect";
  width?: number;
  height?: number;
  strokeStyle?: string;
  lineWidth?: number;
  fillStyle?: string;
}

export interface CircleProps extends BaseShapeProps {
  type: "circle";
  radius: number;
  strokeStyle?: string;
  lineWidth?: number;
  fillStyle?: string;
}

export interface TextProps extends BaseShapeProps {
  type: "text";
  text: string;
  font?: string;
}

export type ShapeProps = RectProps | CircleProps | TextProps;

export interface CanvasRectElement extends InstanceAttributes {
  width?: number;
  height?: number;
}

export interface CanvasCircleElement extends InstanceAttributes {
  radius?: number;
}

export interface CanvasTextElement extends InstanceAttributes {
  text?: string;
  font?: string;
}

export type ShapePropsMap = {
  canvasRect: RectProps;
  canvasCircle: CircleProps;
  canvasText: TextProps;
};

export type Type = `canvas${Capitalize<ShapeProps["type"]>}`;
export type Props = ShapeProps;
export type Container = RootState;

export type InstanceAttributes = {
  x: number;
  y: number;
};

export type Instance = {
  type: Type;
  props: Props;
  parent: Instance | null;
  children: Instance[];
  attributes: InstanceAttributes;
  container: Container;
};
export type TextInstance = never;
export type SuspenseInstance = never;
export type HydratableInstance = never;
export type PublicInstance = InstanceAttributes;
export type HostContext = Record<string, never>;
export type UpdatePayload = Partial<Props> | null;
export type ChildSet = never;
export type TimeoutHandle = number;
export type NoTimeout = -1;
