import { forwardRef } from 'react';

/**
 * Reusable Tabs component
 *
 * Props:
 *  - tabs:      Array<{ id: string, label: string, icon?: ReactNode, badge?: string|number, disabled?: boolean }>
 *  - activeTab: string
 *  - onChange:  (tabId: string) => void
 *  - variant:   'line' | 'pills' (default: 'line')
 *  - fullWidth: boolean (default: false)
 *  - className: string
 */

const Tabs = forwardRef(({
  tabs = [],
  activeTab,
  onChange,
  variant = 'line',
  fullWidth = false,
  className = '',
  style: extraStyle = {},
  ...rest
}, ref) => {
  return (
    <div
      ref={ref}
      className={`flex items-center gap-1 overflow-x-auto flex-nowrap whitespace-nowrap select-none scrollbar-none w-full max-w-full ${
        variant === 'line' ? 'border-b border-slate-800' : 'p-1 rounded-xl bg-slate-900/60 border border-slate-800/80'
      } ${className}`}
      style={extraStyle}
      role="tablist"
      {...rest}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const isDisabled = tab.disabled;

        if (variant === 'pills') {
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              disabled={isDisabled}
              onClick={() => !isDisabled && onChange && onChange(tab.id)}
              className={`flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex-shrink-0 ${
                fullWidth ? 'flex-1' : ''
              } ${
                isDisabled
                  ? 'opacity-40 cursor-not-allowed text-slate-500'
                  : isActive
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.15)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="px-1.5 py-0.5 text-[10px] rounded bg-slate-800 text-slate-300 font-mono">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        }

        // Default 'line' variant
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={isDisabled}
            onClick={() => !isDisabled && onChange && onChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-t-sm flex-shrink-0 ${
              fullWidth ? 'flex-1 justify-center' : ''
            } ${
              isDisabled
                ? 'opacity-40 cursor-not-allowed border-transparent text-slate-600'
                : isActive
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="px-1.5 py-0.5 text-[10px] rounded bg-slate-800 text-slate-400 font-medium">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
});

Tabs.displayName = 'Tabs';
export default Tabs;
