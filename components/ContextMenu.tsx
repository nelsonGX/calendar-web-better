import React from 'react';
import { ContextMenuProps } from './types/calendar';

const ContextMenu: React.FC<ContextMenuProps> = ({
  contextMenu,
  isAdmin,
  onQuickColorChange,
  onDeleteEvent,
  onClose
}) => {
  if (!contextMenu || !isAdmin) return null;

  const handleColorChange = (color: string) => {
    onQuickColorChange(contextMenu.event, color);
  };

  const handleDelete = () => {
    onDeleteEvent(contextMenu.event.id);
    onClose();
  };

  return (
    <div
      className="fixed bg-zinc-800 border border-zinc-600 rounded-lg shadow-lg py-2 z-50 animate-popIn"
      style={{
        left: `${contextMenu.x}px`,
        top: `${contextMenu.y}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-3 py-1 text-xs text-zinc-400 font-medium">Quick Actions</div>
      <div className="border-t border-zinc-600 my-1"></div>
      
      <div className="px-3 py-1 text-xs text-zinc-400 font-medium">Change Color</div>
      <div className="flex gap-1 px-3 py-2">
        <button
          onClick={() => handleColorChange('#ef4444')}
          className="w-6 h-6 rounded-full bg-red-500 hover:bg-red-400 transition-colors border-2 border-transparent hover:border-white"
          title="Red"
        />
        <button
          onClick={() => handleColorChange('#22c55e')}
          className="w-6 h-6 rounded-full bg-green-500 hover:bg-green-400 transition-colors border-2 border-transparent hover:border-white"
          title="Green"
        />
        <button
          onClick={() => handleColorChange('#3b82f6')}
          className="w-6 h-6 rounded-full bg-orange-500 hover:bg-orange-400 transition-colors border-2 border-transparent hover:border-white"
          title="Orange"
        />
      </div>
      
      <div className="border-t border-zinc-600 my-1"></div>
      <button
        onClick={handleDelete}
        className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-zinc-700 transition-colors"
      >
        Quick Delete
      </button>
    </div>
  );
};

export default ContextMenu;