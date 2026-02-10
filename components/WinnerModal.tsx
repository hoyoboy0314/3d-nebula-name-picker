
import React from 'react';
import { Trophy, X, PartyPopper, Sparkles } from 'lucide-react';

interface WinnerModalProps {
  winners: string[];
  onClose: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winners, onClose }) => {
  const isMultiple = winners.length > 1;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`relative w-full ${isMultiple ? 'max-w-2xl' : 'max-w-md'} transform transition-all animate-in zoom-in-95 duration-500`}>
        
        {/* Glow effect */}
        <div className="absolute -inset-2 bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600 rounded-[3rem] blur-2xl opacity-50 animate-pulse" />

        <div className="relative bg-zinc-900 border-4 border-yellow-500/50 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Close Button */}
          <div className="absolute top-4 right-4 z-10">
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <div className="p-8 text-center flex-shrink-0">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Trophy className="w-16 h-16 text-yellow-400 animate-bounce" />
                <PartyPopper className="absolute -top-2 -right-4 w-8 h-8 text-pink-400 animate-pulse" />
                <Sparkles className="absolute bottom-0 -left-4 w-6 h-6 text-cyan-400 animate-pulse delay-75" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-400 tracking-widest uppercase mb-2">
              {isMultiple ? `恭喜 ${winners.length} 位幸運兒` : '恭喜中獎者'}
            </h3>
          </div>
          
          {/* Winners Content */}
          <div className={`
            px-8 pb-8 overflow-y-auto custom-scrollbar
            ${isMultiple ? 'grid grid-cols-2 md:grid-cols-3 gap-4' : 'flex justify-center'}
          `}>
            {winners.map((name, index) => (
              <div 
                key={index}
                className={`
                  relative group bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden
                  ${isMultiple ? 'aspect-[3/1] py-3 px-2' : 'w-full py-12 px-6'}
                `}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <h2 className={`
                  font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 drop-shadow-sm truncate w-full text-center
                  ${isMultiple ? 'text-xl md:text-2xl' : 'text-4xl md:text-6xl'}
                `}>
                  {name}
                </h2>
              </div>
            ))}
          </div>

          <div className="p-6 bg-black/20 flex-shrink-0">
            <button
              onClick={onClose}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-black text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 fill-black/20" />
              太棒了！
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinnerModal;
