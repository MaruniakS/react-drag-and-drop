import React, { useMemo, useState } from "react";
import { Table as AntTable } from "antd";
import styled from "styled-components";
import { MenuOutlined } from "@ant-design/icons";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import peopleData from "../data/people";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";

const DraggingIcon = styled(MenuOutlined)`
  cursor: grab;
`;

const DraggingTable = styled(AntTable)`
  .ant-table-row, .ant-table-row .anticon {
    cursor: grabbing;
  }
`

const columns = [
  {
    key: "dragHandle",
    dataIndex: "dragHandle",
    width: 30,
    render: () => <DraggingIcon />,
  },
  {
    key: "name",
    dataIndex: "name",
    title: "Name",
  },
  {
    key: "age",
    dataIndex: "age",
    title: "Age",
  },
];

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
    opacity: isDragging && 0.5
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

const Table = () => {
  const [dataSource, setDataSource] = useState(peopleData);
  const [activeId, setActiveId] = useState(null);

  const items = useMemo(() => dataSource.map(({ id }) => id), [dataSource]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
    useSensor(MouseSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    // @ts-ignore
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setDataSource((data) => {
        // @ts-ignore
        const oldIndex = items.indexOf(active.id);
        // @ts-ignore
        const newIndex = items.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  };

  const handleDragCancel = () => setActiveId(null);

  const selectedItem = useMemo(() => {
    if (!activeId) return null;
    return dataSource.find(({ id }) => id === activeId);
  }, [dataSource, activeId]);

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
    >
      <AntTable
        rowKey="id"
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        components={{
          body: {
            wrapper: DraggableWrapper,
            row: DraggableRow,
          },
        }}
      />
      <DragOverlay>
        {selectedItem && (
          <DraggingTable
            columns={columns}
            dataSource={[selectedItem]}
            pagination={false}
            showHeader={false}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default Table;
