import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const DraggableRow = (props: any) => {
  const id = props["data-row-key"];
  const {
    attributes,
    listeners,
    transform,
    transition,
    setNodeRef,
    isDragging,
  } = useSortable({ id });
  const { children, style, ...restProps } = props;

  const rowStyle = {
    ...style,
    transform: CSS.Transform.toString(transform),
    transition: transition,
    opacity: isDragging && 0.5,
  };

  const hasCells = children instanceof Array;

  if (!hasCells) return <tr {...restProps}>{children}</tr>;

  return (
    <tr
      ref={setNodeRef}
      key={id}
      style={rowStyle}
      {...attributes}
      {...restProps}
    >
      {React.Children.map(children, (child) => {
        const isDraggableColumn = child.key === "dragHandle";
        if (!isDraggableColumn) {
          return child;
        }
        return (
          <td key="dragHandle" {...listeners}>
            {child}
          </td>
        );
      })}
    </tr>
  );
};

export default DraggableRow;
