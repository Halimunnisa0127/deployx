import { AlertOctagon, RefreshCw, ExternalLink } from "lucide-react";
import Button from "./Button";

export default function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred while loading this module.",
  onRetry,
  supportLink,
  minHeight = "h-[400px]",
}) {
  return (
    <div
      className={`bg-slate-900/60 rounded-2xl border border-rose-900/50 p-8 flex flex-col items-center justify-center text-center shadow-lg ${minHeight}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6">
        <AlertOctagon className="w-8 h-8 text-rose-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 max-w-sm mb-8">{message}</p>

      <div className="flex flex-col sm:flex-row gap-3">
        {supportLink && (
          <Button
            variant="secondary"
            onClick={() => window.open(supportLink, "_blank")}
            iconLeft={<ExternalLink className="w-4 h-4" />}
          >
            Contact Support
          </Button>
        )}
        {onRetry && (
          <Button
            variant="primary"
            onClick={onRetry}
            iconLeft={<RefreshCw className="w-4 h-4" />}
          >
            Retry Request
          </Button>
        )}
      </div>
    </div>
  );
}
