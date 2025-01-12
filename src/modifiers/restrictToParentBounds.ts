import { Modifier } from '@dnd-kit/core'; // ✅ Asegura que Modifier está importado

interface NodeRect {
  width: number;
  height: number;
  top: number;
  left: number;
  bottom: number;
  right: number;
}

export const restrictToParentBounds: Modifier = ({
  transform,
  activeNodeRect,
  containerNodeRect,
}: {
  transform: { x: number; y: number };
  activeNodeRect: NodeRect | null;
  containerNodeRect: NodeRect | null;
}) => {
  if (!activeNodeRect || !containerNodeRect) {
    return transform;
  }

  // ✅ Límites superiores e inferiores exactos
  const minY = 0;
  const maxY = containerNodeRect.height - activeNodeRect.height;

  return {
    ...transform,
    y: Math.max(minY, Math.min(transform.y, maxY)), // 🔒 Bloquea fuera del contenedor
    x: 0, // 🔒 Solo permite movimiento vertical
  };
};
