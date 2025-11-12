import {
  CircleProps,
  RectProps,
  ShapeProps,
  TextProps,
} from "./CanvasReconciler";

type NodeProps<TProps extends ShapeProps> = Omit<TProps, 'type'>

type CanvasElement<TProps extends ShapeProps> = NodeProps<TProps> & React.RefAttributes<Instance> & { children?: ReactNode | undefined };

declare global {
  namespace JSX {
    interface IntrinsicElements {
      canvasRect: CanvasElement<RectProps>;
      canvasCircle: CanvasElement<CircleProps>;
      canvasText: CanvasElement<TextProps>;
    }
  }
}

export {};