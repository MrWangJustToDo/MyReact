import { useAppContext } from "../components/App.js";

export const useRenderer = () => {
  const { renderer } = useAppContext();

  if (!renderer) {
    throw new Error("Renderer not found.");
  }

  return renderer;
};
