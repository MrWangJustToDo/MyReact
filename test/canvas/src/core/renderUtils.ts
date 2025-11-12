import type { Container, Instance, RootState, ShapePropsMap, Type } from "./types";

export const debounce = (fn: () => void, delay: number) => {
  let timeoutId: number;
  return () => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(fn, delay);
  };
};

export const resizeCanvas = (canvas: HTMLCanvasElement, state: RootState) => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const dpr = window.devicePixelRatio ?? 1;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  state.dpr = dpr;
  state.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
};

export const isShapeOfType = <T extends Type>(type: T, instance: Instance): instance is Instance & { type: T; props: ShapePropsMap[T] } => {
  return instance.type === type;
};

export function assertShapeType<T extends Type>(type: T, instance: Instance): asserts instance is Instance & { type: T; props: ShapePropsMap[T] } {
  if (!isShapeOfType(type, instance)) {
    throw new Error(`Mismatched shape type. Expected ${type}, but got ${instance.type}`);
  }
}

export const getClickCoordinates = (canvas: HTMLCanvasElement, event: MouseEvent, dpr: number): { x: number; y: number } => {
  const rect = canvas.getBoundingClientRect();
  const x = (event.clientX - rect.left) * (canvas.width / rect.width / dpr);
  const y = (event.clientY - rect.top) * (canvas.height / rect.height / dpr);
  return { x, y };
};

export const testShape = (instance: Instance, container: Container, x: number, y: number, parentX = 0, parentY = 0): Instance | null => {
  const { type, props } = instance;
  const absX = parentX + props.x;
  const absY = parentY + props.y;

  // Check children first, in reverse order
  for (let i = instance.children.length - 1; i >= 0; i--) {
    const child = instance.children[i];
    const childHit = testShape(child, container, x, y, absX, absY);
    if (childHit) {
      return childHit;
    }
  }

  let hit = false;

  switch (type) {
    case "canvasRect": {
      assertShapeType("canvasRect", instance);
      const { props } = instance;

      hit = x >= absX && x <= absX + (props.width ?? 0) && y >= absY && y <= absY + (props.height ?? 0);
      break;
    }
    case "canvasCircle": {
      assertShapeType("canvasCircle", instance);
      const { props } = instance;
      const centerX = absX + props.radius;
      const centerY = absY + props.radius;
      const dx = x - centerX;
      const dy = y - centerY;
      hit = dx * dx + dy * dy <= props.radius * props.radius;
      break;
    }
    case "canvasText": {
      assertShapeType("canvasText", instance);
      const { props } = instance;

      const ctx = container.ctx;
      ctx.font = props.font ?? "12px Arial";
      const textMetrics = ctx.measureText(props.text);
      const textWidth = textMetrics.width;
      const textHeight = parseInt(props.font?.split("px")[0] ?? "12", 10);
      hit = x >= absX && x <= absX + textWidth && y >= absY - textHeight && y <= absY;
      break;
    }
  }

  if (hit) {
    return instance;
  }

  return null;
};

export const renderInstance = (instance: Instance, container: Container, parentX = 0, parentY = 0) => {
  const { ctx } = container;
  const { type, props, attributes } = instance;

  const x = parentX + (attributes.x !== undefined ? attributes.x : props.x);
  const y = parentY + (attributes.y !== undefined ? attributes.y : props.y);

  ctx.save();

  switch (type) {
    case "canvasRect": {
      assertShapeType("canvasRect", instance);
      const { props } = instance;
      ctx.fillStyle = props.fillStyle || props.color || "black";
      ctx.fillRect(x, y, props.width ?? 0, props.height ?? 0);

      if (props.strokeStyle) {
        ctx.strokeStyle = props.strokeStyle;
        ctx.lineWidth = props.lineWidth || 1;
        ctx.strokeRect(x, y, props.width ?? 0, props.height ?? 0);
      }
      break;
    }
    case "canvasCircle": {
      assertShapeType("canvasCircle", instance);
      const { props } = instance;
      ctx.beginPath();
      ctx.arc(x + props.radius, y + props.radius, props.radius, 0, 2 * Math.PI);

      if (props.fillStyle || props.color) {
        ctx.fillStyle = props.fillStyle || props.color || "black";
        ctx.fill();
      }

      if (props.strokeStyle) {
        ctx.strokeStyle = props.strokeStyle;
        ctx.lineWidth = props.lineWidth || 1;
        ctx.stroke();
      }
      break;
    }
    case "canvasText": {
      assertShapeType("canvasText", instance);
      const { props } = instance;
      ctx.fillStyle = props?.color || "red";
      ctx.font = props?.font || "12px Arial";
      ctx.fillText(props?.text || "Hello World", x, y);
      break;
    }
  }

  ctx.restore();

  for (const child of instance.children) {
    renderInstance(child, container, x, y);
  }
};

export const hitTest = (container: Container, x: number, y: number): Instance | null => {
  for (let i = container.children.length - 1; i >= 0; i--) {
    const hit = testShape(container.children[i], container, x, y);
    if (hit) {
      return hit;
    }
  }

  return null;
};

export const renderAll = (container: Container) => {
  const { ctx, canvas } = container;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const child of container.children) {
    renderInstance(child, container);
  }

  ctx.restore();
};
