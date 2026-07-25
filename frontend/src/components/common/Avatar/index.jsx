import { useMemo } from 'react';

/**
 * Reusable Avatar component
 *
 * Props:
 *  - src:       string (image URL)
 *  - name:      string (user or workspace name for fallback initials)
 *  - size:      'xs' | 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
 *  - status:    'online' | 'offline' | 'busy' | 'away' | null (default: null)
 *  - variant:   'circle' | 'rounded' (default: 'rounded')
 *  - className: string
 *  - style:     object
 */

const SIZES = {
  xs: { width: 24, height: 24, fontSize: 10, statusSize: 6 },
  sm: { width: 32, height: 32, fontSize: 12, statusSize: 8 },
  md: { width: 40, height: 40, fontSize: 14, statusSize: 10 },
  lg: { width: 48, height: 48, fontSize: 16, statusSize: 12 },
  xl: { width: 64, height: 64, fontSize: 20, statusSize: 14 },
};

const STATUS_COLORS = {
  online: '#22c55e',
  offline: '#64748b',
  busy: '#ef4444',
  away: '#f59e0b',
};

export default function Avatar({
  src,
  name = '',
  size = 'md',
  status = null,
  variant = 'rounded',
  className = '',
  style: extraStyle = {},
  ...rest
}) {
  const sizeConfig = SIZES[size] || SIZES.md;

  const initials = useMemo(() => {
    if (!name) return 'DX';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [name]);

  const borderRadius = variant === 'circle' ? '9999px' : '10px';

  return (
    <div
      className={`relative inline-flex flex-shrink-0 items-center justify-center select-none ${className}`}
      style={{
        width: `${sizeConfig.width}px`,
        height: `${sizeConfig.height}px`,
        ...extraStyle,
      }}
      {...rest}
    >
      {src ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          style={{ borderRadius }}
          className="w-full h-full object-cover border border-white/10"
        />
      ) : (
        <div
          style={{
            borderRadius,
            fontSize: `${sizeConfig.fontSize}px`,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          }}
          className="w-full h-full flex items-center justify-center font-bold text-white shadow-inner border border-white/20"
        >
          {initials}
        </div>
      )}

      {status && STATUS_COLORS[status] && (
        <span
          className="absolute bottom-0 right-0 rounded-full ring-2 ring-[#0b0f19]"
          style={{
            width: `${sizeConfig.statusSize}px`,
            height: `${sizeConfig.statusSize}px`,
            backgroundColor: STATUS_COLORS[status],
          }}
        />
      )}
    </div>
  );
}
