/**
 * Reusable Card component
 *
 * Props:
 *  - children
 *  - style — optional overrides
 *  - onClick — makes the card interactive (cursor: pointer)
 *  - ...rest — any native div attrs
 */

export default function Card({ children, style: extraStyle, onClick, ...rest }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        padding: '20px 24px',
        transition: 'border-color 0.2s, transform 0.15s',
        cursor: onClick ? 'pointer' : 'default',
        ...extraStyle,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
