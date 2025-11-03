import { useAppContext } from "../components/App"

export const useRenderer = () => {
  const { renderer } = useAppContext()

  if (!renderer) {
    throw new Error("Renderer not found.")
  }

  return renderer
}