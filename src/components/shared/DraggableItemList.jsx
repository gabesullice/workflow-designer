import React from 'react';
import { useDragAndDrop } from '../../hooks/useDragAndDrop.js';
import './DraggableItemList.css';

function DraggableItemList({ 
  items, 
  setItems,
  renderItem, 
  itemClassName = 'item',
  onDelete,
  // Optional: provide all drag handlers to override default behavior
  customDragHandlers
}) {
  const internalDragAndDrop = useDragAndDrop(items, setItems);
  
  // Use custom handlers if provided, otherwise use internal ones
  const { draggedIndex, handleDragStart, handleDragOver, handleDrop } = customDragHandlers || internalDragAndDrop;

  const handleDelete = (item, index) => {
    if (onDelete) {
      onDelete(item, index);
    } else {
      // Default behavior: remove item from list
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  return (
    <ul className="draggable-item-list">
      {items.map((item, index) => (
        <li 
          key={item.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
          className={`draggable-item ${draggedIndex === index ? 'dragging' : ''} ${itemClassName}`}
        >
          <div className="drag-handle">
            <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
              <circle cx="3" cy="3" r="1.5" fill="#666"/>
              <circle cx="9" cy="3" r="1.5" fill="#666"/>
              <circle cx="3" cy="8" r="1.5" fill="#666"/>
              <circle cx="9" cy="8" r="1.5" fill="#666"/>
              <circle cx="3" cy="13" r="1.5" fill="#666"/>
              <circle cx="9" cy="13" r="1.5" fill="#666"/>
            </svg>
          </div>
          
          <div className="item-content">
            {renderItem(item, index)}
          </div>
          
          <button
            onClick={() => handleDelete(item, index)}
            className="delete-button"
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
}

export default DraggableItemList;