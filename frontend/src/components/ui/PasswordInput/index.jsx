import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Input from '../Input';

/**
 * Reusable PasswordInput component
 *
 * Props:
 *  - label:       string
 *  - error:       string
 *  - id:          string
 *  - fullWidth:   boolean (default: true)
 *  - helperText:  string
 *  - ...rest      — any native <input> attribute
 */
const PasswordInput = forwardRef(({ style: extraStyle, ...rest }, ref) => {
  const [show, setShow] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <Input
        ref={ref}
        type={show ? 'text' : 'password'}
        style={{ paddingRight: '44px', ...extraStyle }}
        {...rest}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        style={toggleBtnStyle}
        tabIndex="-1" // prevent tab to toggle
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';
export default PasswordInput;

const toggleBtnStyle = {
  position: 'absolute',
  right: '14px',
  top: '36px', // Align precisely within the 12px padded input (+ label space)
  background: 'transparent',
  border: 'none',
  color: '#94a3b8',
  cursor: 'pointer',
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'color 0.2s ease',
};
