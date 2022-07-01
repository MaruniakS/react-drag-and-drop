import React from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const DraggableWrapper = (props: any) => {
  const { children, ...restProps } = props;
  const hasData = children[1] instanceof Array;
  if (!hasData) return <tbody {...restProps}>{children}</tbody>;
  const items = children[1].map((child: any) => Number(child.key));
  return (
    <SortableContext
      items={items}
      strategy={verticalListSortingStrategy}
      {...restProps}
    >
      <tbody {...restProps}>{children}</tbody>
    </SortableContext>
  );
};

export default DraggableWrapper;
