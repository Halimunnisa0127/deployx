import Card from '../Card';
import Skeleton from './index';

export default function SkeletonTable({ rows = 5, columns = 4, className = '', style }) {
  return (
    <Card className={`w-full max-w-full ${className}`} style={{ padding: '0', overflow: 'hidden', ...style }}>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50">
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="p-4">
                  <Skeleton width="60%" height="16px" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-slate-100 dark:border-white/5 last:border-0">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="p-4">
                    <Skeleton width={colIndex === 0 ? '70%' : '50%'} height="14px" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
