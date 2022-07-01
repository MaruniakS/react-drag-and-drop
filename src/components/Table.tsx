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
import { arrayMove } from "@dnd-kit/sortable";

import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

import DraggableWrapper from "./DraggableWrapper";
import DraggableRow from "./DraggableRow";
import peopleData from "../data/people";

const DraggingIcon = styled(MenuOutlined)`
  cursor: grab;
`;

const DraggingTable = styled(AntTable)`
  .ant-table-row,
  .ant-table-row .anticon {
    cursor: grabbing;
  }
`;

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
