/**
 * Reusable Modal component
 *
 * Props:
 *  - isOpen:   boolean — controls visibility
 *  - onClose:  function — called when backdrop or ✕ is clicked
 *  - title:    string  — displayed in modal header
 *  - children  — modal body content
 *  - maxWidth: string  — CSS max-width of the panel (default: '440px')
 */

export default function Modal({ isOpen, onClose, title, children, maxWidth = '440px' }) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-in fade-in duration-200"
      onClick={handleOverlayClick} 
      role="dialog" 
      aria-modal="true" 
      aria-label={title}
    >
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 w-full shadow-2xl animate-in zoom-in-95 duration-200 font-sans"
        style={{ maxWidth }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="m-0 text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h2>
          <button 
            className="bg-transparent border-none text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-lg cursor-pointer leading-none p-1 transition-colors"
            onClick={onClose} 
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div>{children}</div>
      </div>
    </div>
  );
}
