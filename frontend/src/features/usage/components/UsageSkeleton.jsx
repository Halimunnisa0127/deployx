import Skeleton from '../../../components/ui/Skeleton';
import Card from '../../../components/ui/Card';

export default function UsageSkeleton() {
  return (
    <div className="space-y-6 md:space-y-8 pb-8 animate-pulse">
      {/* 1. Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div className="space-y-2">
          <Skeleton height="32px" width="180px" borderRadius="10px" />
          <Skeleton height="16px" width="380px" borderRadius="6px" />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Skeleton height="38px" width="130px" borderRadius="12px" />
          <Skeleton height="38px" width="130px" borderRadius="12px" />
          <Skeleton height="38px" width="38px" borderRadius="12px" />
          <Skeleton height="24px" width="120px" borderRadius="9999px" />
        </div>
      </div>

      {/* 2. Overview Cards Skeleton (4 Cards) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton height="20px" width="160px" borderRadius="6px" />
          <Skeleton height="16px" width="100px" borderRadius="6px" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {[1, 2, 3, 4].map((i) => (
            <Card
              key={i}
              className="p-5 border border-border rounded-2xl bg-card/60 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Skeleton height="36px" width="36px" borderRadius="10px" />
                  <Skeleton height="16px" width="90px" borderRadius="6px" />
                </div>
                <Skeleton height="20px" width="60px" borderRadius="9999px" />
              </div>
              <div className="space-y-1.5 pt-1">
                <Skeleton height="34px" width="120px" borderRadius="8px" />
                <Skeleton height="14px" width="100px" borderRadius="4px" />
              </div>
              <Skeleton height="8px" borderRadius="9999px" />
              <div className="grid grid-cols-3 gap-2 pt-1">
                <Skeleton height="24px" borderRadius="6px" />
                <Skeleton height="24px" borderRadius="6px" />
                <Skeleton height="24px" borderRadius="6px" />
              </div>
              <Skeleton height="40px" borderRadius="8px" />
            </Card>
          ))}
        </div>
      </div>

      {/* 3. Usage Trends Chart Skeleton */}
      <Card className="p-6 border border-border rounded-2xl bg-card/60 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton height="36px" width="36px" borderRadius="10px" />
            <div className="space-y-1">
              <Skeleton height="20px" width="150px" borderRadius="6px" />
              <Skeleton height="14px" width="220px" borderRadius="4px" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton height="34px" width="180px" borderRadius="10px" />
            <Skeleton height="34px" width="120px" borderRadius="10px" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Skeleton height="32px" width="320px" borderRadius="10px" />
          <Skeleton height="28px" width="100px" borderRadius="8px" />
        </div>

        <Skeleton height="260px" borderRadius="16px" />
      </Card>

      {/* 4. Quotas Breakdown Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i} className="p-6 border border-border rounded-2xl bg-card/60 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton height="24px" width="180px" borderRadius="6px" />
              <Skeleton height="20px" width="80px" borderRadius="9999px" />
            </div>
            <div className="space-y-3 pt-2">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="p-3.5 rounded-xl border border-border space-y-2">
                  <div className="flex justify-between">
                    <Skeleton height="16px" width="110px" borderRadius="4px" />
                    <Skeleton height="16px" width="70px" borderRadius="4px" />
                  </div>
                  <Skeleton height="6px" borderRadius="9999px" />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* 5. Table Skeleton */}
      <Card className="p-6 border border-border rounded-2xl bg-card/60 space-y-4">
        <div className="flex justify-between items-center pb-2">
          <Skeleton height="24px" width="140px" borderRadius="6px" />
          <div className="flex gap-2">
            <Skeleton height="32px" width="180px" borderRadius="8px" />
            <Skeleton height="32px" width="120px" borderRadius="8px" />
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((k) => (
            <Skeleton key={k} height="42px" borderRadius="10px" />
          ))}
        </div>
      </Card>
    </div>
  );
}

