
export const Image = ({ src, alt, className = '' }) => {
  return (
    <img src={src} alt={alt} className={`object-contain ${className}`} />
  );
};
