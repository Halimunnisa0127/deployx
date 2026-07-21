/**
 * Reusable Form component
 *
 * A thin semantic wrapper around <form> that:
 *  - Provides consistent vertical stack layout with configurable gap
 *  - Passes all native <form> attributes through via ...rest
 *  - Prevents default submit behaviour unless the consumer overrides onSubmit
 *
 * Props:
 *  - onSubmit:  (e) => void  — form submit handler (e.preventDefault() already called)
 *  - gap:       string       — CSS gap between children (default: '16px')
 *  - children
 *  - style      — optional style overrides
 *  - ...rest    — any native <form> attribute
 */
export default function Form({ onSubmit, gap = '16px', children, style: extraStyle, ...rest }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap,
        width: '100%',
        ...extraStyle,
      }}
      {...rest}
    >
      {children}
    </form>
  );
}
