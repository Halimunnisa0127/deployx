/**
 * Reusable ScrollArea component
 *
 * Props:
 *  - children:  ReactNode
 *  - maxHeight: string | number
 *  - className: string
 *  - style:     object
 */
export default function ScrollArea({
  children,
  maxHeight,
  className = '',
  style: extraStyle = {},
  ...rest
}) {
  return (
    <div
      className={`overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent ${className}`}
      style={{
        maxHeight: maxHeight ? (typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight) : undefined,
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(255, 255, 255, 0.1) transparent',
        ...extraStyle,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
