import React, { useState } from 'react';
import DraggableItemList from './DraggableItemList.jsx';

const StatefulDraggableList = (args) => {
  const [items, setItems] = useState(args.items);
  return (
    <DraggableItemList
      {...args}
      items={items}
      setItems={setItems}
    />
  );
};

export default {
  title: 'Components/Shared/DraggableItemList',
  component: DraggableItemList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  render: StatefulDraggableList,
};

export const Default = {
  args: {
    items: [
      { id: '1', label: 'First Item' },
      { id: '2', label: 'Second Item' },
      { id: '3', label: 'Third Item' },
      { id: '4', label: 'Fourth Item' },
    ],
    renderItem: (item) => item.label,
    itemClassName: 'item',
  }
};

export const SingleItem = {
  args: {
    items: [
      { id: '1', label: 'Only Item' },
    ],
    renderItem: (item) => item.label,
  }
};

export const EmptyList = {
  args: {
    items: [],
    renderItem: (item) => item.label,
  }
};