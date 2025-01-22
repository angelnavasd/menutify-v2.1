import type { Modifier } from '@dnd-kit/core';

export const restrictToParentBounds: Modifier = ({
  transform,
}: {
  transform: { x: number; y: number };
}) => {
  return {
    ...transform,
    y: transform.y,
    x: transform.x,
    scaleX: 1,
    scaleY: 1
  };
};
