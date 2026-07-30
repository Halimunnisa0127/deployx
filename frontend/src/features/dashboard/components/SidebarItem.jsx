import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import Tooltip from '../../../components/ui/Tooltip';

/**
 * Feature-scoped SidebarItem for DeployX Dashboard
 *
 * Props:
 *  - icon:        ReactNode / Icon Component
 *  - label:       string
 *  - href:        string
 *  - badge:       string | number
 *  - isActive:    boolean
 *  - isCollapsed: boolean
 *  - onClick:     function
 */

export default function SidebarItem({
  icon: Icon,
  label,
  href,
  badge,
  isActive = false,
  isCollapsed = false,
  onClick,
}) {
  const content = (
    <NavLink
      to={href}
      end={href === '/dashboard'}
      onClick={onClick}
      className={({ isActive: isLinkActive }) => {
        const active = isActive || isLinkActive;
        return `relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 group outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 select-none ${
          isCollapsed ? 'justify-center px-0 w-10 h-10 mx-auto' : 'w-full'
        } ${
          active
            ? 'bg-indigo-50/90 dark:bg-slate-900/90 text-indigo-900 dark:text-white font-semibold shadow-sm dark:shadow-[0_0_15px_rgba(99,102,241,0.12)] border border-transparent'
            : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 border border-transparent'
        }`;
      }}
    >
      {({ isActive: isLinkActive }) => {
        const active = isActive || isLinkActive;

        return (
          <>
            {/* Active left accent line indicator */}
            {active && (
              <motion.div
                layoutId="activePill"
                className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-indigo-500 rounded-r-full shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}

            {/* Icon with 2px hover move */}
            {Icon && (
              <span
                className={`flex-shrink-0 transition-transform duration-200 group-hover:translate-x-[2px] ${
                  active ? 'text-indigo-600 dark:text-indigo-400 scale-105' : 'text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-300'
                }`}
              >
                {typeof Icon === 'function' || (typeof Icon === 'object' && Icon.$$typeof) ? (
                  <Icon className="w-5 h-5" />
                ) : (
                  Icon
                )}
              </span>
            )}

            {/* Label & Badge when expanded */}
            {!isCollapsed && (
              <div className="flex-1 flex items-center justify-between min-w-0">
                <span className="truncate">{label}</span>

                {badge !== undefined && badge !== null && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-md border ${
                      active
                        ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/40'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/60 group-hover:border-slate-300 dark:group-hover:border-slate-600'
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </div>
            )}
          </>
        );
      }}
    </NavLink>
  );

  if (isCollapsed) {
    return (
      <Tooltip content={label} position="right">
        {content}
      </Tooltip>
    );
  }

  return content;
}
