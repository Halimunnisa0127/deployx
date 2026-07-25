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
            ? 'bg-gradient-to-r from-indigo-600/20 to-violet-600/10 text-white font-semibold border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
        }`;
      }}
    >
      {({ isActive: isLinkActive }) => {
        const active = isActive || isLinkActive;

        return (
          <>
            {/* Active left indicator bar when expanded */}
            {active && !isCollapsed && (
              <motion.div
                layoutId="activePill"
                className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-indigo-500 to-violet-500 rounded-r-full shadow-[0_0_8px_#6366f1]"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}

            {/* Icon */}
            {Icon && (
              <span
                className={`flex-shrink-0 transition-all duration-200 ${
                  active ? 'text-indigo-400 scale-110' : 'text-slate-400 group-hover:text-indigo-300'
                }`}
              >
                {typeof Icon === 'function' || typeof Icon === 'object' && Icon.$$typeof ? (
                  <Icon className="w-4 h-4" />
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
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700/60 group-hover:border-slate-600'
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
