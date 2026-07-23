/**
 * Reusable Divider component
 *
 * Props:
 *  - children: optional text to render in the middle (e.g., "OR")
 *  - style: optional inline styles for the container
 */
export default function Divider({ children, style: extraStyle }) {
  return (
    <div style={{ ...containerStyle, ...extraStyle }}>
      <div style={lineStyle} />
      {children && (
        <span style={textStyle}>{children}</span>
      )}
      <div style={lineStyle} />
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  margin: '28px 0',
};

const lineStyle = {
  flex: 1,
  height: '1px',
  background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 100%)',
};

const textStyle = {
  padding: '0 16px',
  color: '#475569',
  fontSize: '11px',
  fontFamily: "'Inter', sans-serif",
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
  fontWeight: 600,
};
