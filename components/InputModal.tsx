
import React, { useState } from 'react';
import { X, Save, Users, Settings2, Palette } from 'lucide-react';

interface InputModalProps {
  names: string[];
  winnerCount: number;
  useRandomColors: boolean;
  onToggleRandomColors: (val: boolean) => void;
  onSave: (names: string[], winnerCount: number) => void;
  onClose: () => void;
}

const InputModal: React.FC<InputModalProps> = ({ 
  names, 
  winnerCount, 
  useRandomColors,
  onToggleRandomColors,
  onSave, 
  onClose 
}) => {
  const [inputText, setInputText] = useState(names.join(' '));
  const [count, setCount] = useState(winnerCount);

  const handleSave = () => {
    // Split by spaces, tabs, or newlines
    const newNames = inputText
      .split(/\s+/)
      .filter(n => n.trim().length > 0);
    
    // Ensure count is valid
    const safeCount = Math.max(1, Math.min(count, newNames.length > 0 ? newNames.length : 1));
    
    onSave(newNames, safeCount);
  };

  const currentCount = inputText.split(/\s+/).filter(n => n.trim()).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Settings2 className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold">抽獎設定</h2>
          </div>
          <button onClick={onClose} className="hover:bg-white/5 p-2 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-8">
          
          {/* Winner Count Section */}
          <div className="space-y-4">
            <label className="flex items-center justify-between text-sm font-bold text-gray-300">
              <span className="flex items-center gap-2"><Users className="w-4 h-4"/> 一次抽出人數</span>
              <span className="text-purple-400 text-lg">{count} <span className="text-xs text-gray-500">人</span></span>
            </label>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500 font-mono">1</span>
              <input 
                type="range" 
                min="1" 
                max={Math.max(10, currentCount)} 
                value={count} 
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <span className="text-xs text-gray-500 font-mono">{Math.max(10, currentCount)}</span>
            </div>
          </div>

          <div className="h-px bg-white/10 w-full" />

          {/* Color Settings Section */}
          <div className="space-y-4">
             <label className="flex items-center justify-between text-sm font-bold text-gray-300">
              <span className="flex items-center gap-2"><Palette className="w-4 h-4"/> 外觀顯示</span>
            </label>
            
            <div className="flex items-center justify-between bg-black/30 p-3 rounded-xl border border-white/5">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-200">隨機鮮豔色彩</span>
                <span className="text-xs text-gray-500">使用多彩名字 (避開紅色)</span>
              </div>
              
              <button 
                onClick={() => onToggleRandomColors(!useRandomColors)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${useRandomColors ? 'bg-blue-500' : 'bg-gray-700'}`}
              >
                <span
                  className={`${useRandomColors ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200`}
                />
              </button>
            </div>
          </div>

          <div className="h-px bg-white/10 w-full" />

          {/* Names Section */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300">參與名單</label>
            <p className="text-xs text-gray-400 mb-2">
              以 <span className="text-blue-400 font-mono">空格</span> 或 <span className="text-blue-400 font-mono">換行</span> 分隔名字。
            </p>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-48 bg-black/50 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono resize-none text-sm leading-relaxed"
              placeholder="Ann_Chen 張幸福 Peter_Pan..."
            />
            <div className="text-xs text-right text-gray-500 italic">
              目前名單: {currentCount} 人
            </div>
          </div>
        </div>

        <div className="p-6 bg-white/5 flex gap-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-semibold text-sm"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="flex-2 flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all font-bold shadow-lg shadow-blue-600/20 text-sm"
          >
            <Save className="w-4 h-4" />
            儲存設定
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputModal;
