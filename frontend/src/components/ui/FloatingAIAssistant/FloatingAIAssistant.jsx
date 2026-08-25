import { useDispatch } from 'react-redux';
import { toggleAIAssistant } from '../../../store/slices/uiSlice';
import Tooltip from '../Tooltip';
import { Sparkles } from 'lucide-react';

/**
 * FloatingAIAssistant Component
 * Persistent floating trigger button for DeployX AI Assistant.
 * Uses the native Sparkles icon as a clean fallback until the 3D robot mascot asset is available.
 */
export default function FloatingAIAssistant() {
  const dispatch = useDispatch();

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Tooltip content="Open DeployX AI" position="left">
        <button
          onClick={() => dispatch(toggleAIAssistant())}
          className="flex items-center justify-center rounded-full text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-500 hover:via-indigo-500 hover:to-sky-500 border border-blue-500/30 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 w-[50px] h-[50px] md:w-auto md:h-14 md:px-4 md:gap-2.5"
          aria-label="Open DeployX AI"
          title="Open DeployX AI"
        >
          {/* Sparkles icon container - easily replaceable by a Lottie player or img tag later */}
          <div className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center shrink-0 overflow-hidden rounded-full bg-white/10">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-sky-300" />
          </div>
          <span className="hidden md:inline font-semibold text-sm tracking-wide">
            DeployX AI
          </span>
        </button>
      </Tooltip>
    </div>
  );
}
