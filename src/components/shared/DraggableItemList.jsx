import React from 'react';
import { useDragAndDrop } from '../../hooks/useDragAndDrop.js';

function DraggableItemList({ 
  items, 
  setItems,
  renderItem, 
  itemClassName = 'item',
  // Optional: provide all drag handlers to override default behavior
  customDragHandlers
}) {
  const internalDragAndDrop = useDragAndDrop(items, setItems);
  
  // Use custom handlers if provided, otherwise use internal ones
  const { draggedIndex, handleDragStart, handleDragOver, handleDrop } = customDragHandlers || internalDragAndDrop;

  return (
    <ul>
      {items.map((item, index) => (
        <li 
          key={item.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
          className={`${itemClassName} ${draggedIndex === index ? 'dragging' : ''}`}
        >
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  );
}

export default DraggableItemList;