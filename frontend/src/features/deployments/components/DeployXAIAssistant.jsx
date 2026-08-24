import { useState, useEffect } from 'react';
import { deploymentsApi } from '../api/deploymentsApi';
import { 
  X, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Terminal, 
  FileCode2,
  ChevronRight,
  RefreshCw,
  Loader2
} from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function DeployXAIAssistant({ deploymentId, onClose, onRedeploy }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await deploymentsApi.analyzeDeployment(deploymentId);
      
      if (response.success && response.data) {
        setAnalysis(response.data);
      } else {
        setError(response.message || 'Failed to analyze deployment');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An unexpected error occurred during AI analysis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (deploymentId) {
      fetchAnalysis();
    }
  }, [deploymentId]);

  const severityColor = {
    low: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    medium: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    high: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
    critical: 'text-red-500 bg-red-500/10 border-red-500/20',
  }[analysis?.severity?.toLowerCase()] || 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end bg-background/80 backdrop-blur-sm p-4 font-sans animate-in fade-in duration-200">
      <div className="w-full max-w-lg h-[90vh] sm:h-auto sm:max-h-[85vh] bg-card border border-border rounded-2xl shadow-2xl flex flex-col animate-in slide-in-from-right-8 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/50 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">DeployX AI Assistant</h3>
              <p className="text-xs text-muted-foreground">Deployment Analysis</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-slate-800">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4 py-12">
              <div className="relative">
                <div className="absolute inset-0 blur-xl bg-indigo-500/20 rounded-full animate-pulse" />
                <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse relative z-10" />
              </div>
              <div className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing build logs...
              </div>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-center space-y-3">
              <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
              <p className="text-sm font-medium text-rose-300">{error}</p>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => fetchAnalysis()}
              >
                Try Again
              </Button>
            </div>
          ) : analysis ? (
            <div className="space-y-6">
              {/* Summary & Severity */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Failure Summary
                  </h4>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border capitalize ${severityColor}`}>
                    {analysis.severity} Severity
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {analysis.summary}
                </p>
              </div>

              <hr className="border-border" />

              {/* Root Cause & Explanation */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Root Cause</h4>
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-sm text-rose-300 font-medium">
                    {analysis.rootCause}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Why it happened</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {analysis.explanation}
                  </p>
                </div>
              </div>

              {/* Fix Instructions */}
              {analysis.fix && analysis.fix.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Recommended Fix
                  </h4>
                  <ul className="space-y-2">
                    {analysis.fix.map((step, idx) => (
                      <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="text-indigo-400 font-mono mt-0.5">{idx + 1}.</span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Commands */}
              {analysis.commands && analysis.commands.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-slate-400" />
                    Suggested Commands
                  </h4>
                  <div className="space-y-1.5">
                    {analysis.commands.map((cmd, idx) => (
                      <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-indigo-500 shrink-0" />
                        <code className="text-xs text-slate-300 font-mono select-all flex-1 break-all">
                          {cmd}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Files to Check */}
              {analysis.filesToCheck && analysis.filesToCheck.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <FileCode2 className="w-3.5 h-3.5 text-slate-400" />
                    Files to Check
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.filesToCheck.map((file, idx) => (
                      <span key={idx} className="px-2 py-1 rounded-md bg-muted border border-border text-xs font-mono text-muted-foreground">
                        {file}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30 rounded-b-2xl flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {analysis?.confidence && (
              <span>Confidence: <strong className="text-foreground">{Math.round(analysis.confidence * 100)}%</strong></span>
            )}
          </div>
          
          <div className="flex gap-2">
            {analysis?.shouldRedeploy && (
              <Button 
                variant="primary" 
                size="sm" 
                iconLeft={<RefreshCw className="w-4 h-4" />}
                onClick={() => {
                  onClose();
                  if (onRedeploy) onRedeploy();
                }}
              >
                Redeploy Now
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
