import React from 'react';
import { Key } from 'lucide-react';
import { ApiKeyModalProps } from './types/calendar';

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  show,
  tempApiKey,
  onTempApiKeyChange,
  onSubmit,
  onCancel
}) => {
  if (!show) return null;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Key className="w-5 h-5" />
            Admin Access
          </h3>
        </div>
        <p className="text-zinc-300 mb-4">Enter your API key to access admin features:</p>
        <div className="space-y-4">
          <input
            type="password"
            placeholder="API Key"
            value={tempApiKey}
            onChange={(e) => onTempApiKeyChange(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-zinc-700 text-white placeholder-zinc-400"
            onKeyPress={handleKeyPress}
          />
          <div className="flex gap-2">
            <button
              onClick={onSubmit}
              disabled={!tempApiKey.trim()}
              className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:bg-zinc-600 disabled:cursor-not-allowed"
            >
              Submit
            </button>
            <button
              onClick={onCancel}
              className="flex-1 bg-zinc-600 text-white py-2 rounded-lg hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;