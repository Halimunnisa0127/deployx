import { useState, useEffect, useRef } from 'react';
import { useLocation, useMatch, useNavigate } from 'react-router-dom';
import { deploymentsApi } from '../api/deploymentsApi';
import { getProjectApi } from '../../projects/api/projects.api';
import { 
  X, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Terminal, 
  FileCode2,
  ChevronRight,
  RefreshCw,
  Loader2,
  Send
} from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function DeployXAIAssistant({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  
  // Context state
  const [contextResolved, setContextResolved] = useState(false);
  const [deploymentContext, setDeploymentContext] = useState(null);
  const [projectContext, setProjectContext] = useState(null);

  // Match routes for context
  const deployMatch = useMatch('/dashboard/deployments/:id');
  const projectMatch = useMatch('/dashboard/projects/:id');
  
  const deploymentId = deployMatch?.params?.id;
  const projectId = projectMatch?.params?.id;

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Resolve Context when drawer opens
  useEffect(() => {
    if (!isOpen) return;
    
    let isMounted = true;

    const resolveContext = async () => {
      setLoading(true);
      
      // Reset context
      setDeploymentContext(null);
      setProjectContext(null);
      setMessages([]);
      
      try {
        if (deploymentId) {
          const depData = await deploymentsApi.getDeploymentDetails(deploymentId);
          if (isMounted) {
            setDeploymentContext(depData?.data || depData);
            
            // Push contextual welcome message
            const status = depData?.data?.status || depData?.status;
            if (status === 'failed') {
              setMessages([{
                id: Date.now(),
                role: 'assistant',
                type: 'failed_deployment_prompt',
                text: `I noticed deployment ${deploymentId} has failed. Would you like me to analyze the build logs to determine the root cause?`,
                deploymentId: deploymentId
              }]);
            } else {
              setMessages([{
                id: Date.now(),
                role: 'assistant',
                type: 'text',
                text: `I'm ready to help with deployment ${deploymentId}. You can ask me about configuration, environment variables, or domains.`
              }]);
            }
          }
        } else if (projectId) {
          const projData = await getProjectApi(projectId);
          if (isMounted) {
            setProjectContext(projData?.data || projData);
            setMessages([{
              id: Date.now(),
              role: 'assistant',
              type: 'text',
              text: `I see you are viewing project ${(projData?.data?.name || projData?.name || projectId)}. How can I help you configure or deploy this project?`
            }]);
          }
        } else {
          // General Context
          if (isMounted) {
            setMessages([{
              id: Date.now(),
              role: 'assistant',
              type: 'text',
              text: "Hi! I'm DeployX AI. How can I help you with your deployments today?"
            }]);
          }
        }
      } catch (err) {
        console.error("Failed to resolve context:", err);
        if (isMounted) {
          setMessages([{
            id: Date.now(),
            role: 'assistant',
            type: 'text',
            text: "Hi! I'm DeployX AI. I encountered an issue loading the page context, but I'm still here to help."
          }]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setContextResolved(true);
        }
      }
    };

    resolveContext();

    return () => { isMounted = false; };
  }, [isOpen, deploymentId, projectId]);

  const handleAnalyzeDeployment = async (targetDeploymentId) => {
    // Check if we already have an analysis for this deployment in the chat
    const alreadyAnalyzed = messages.some(m => m.type === 'analysis_report' && m.deploymentId === targetDeploymentId);
    if (alreadyAnalyzed) return;

    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now(),
      role: 'user',
      type: 'text',
      text: 'Analyze Deployment'
    }]);

    setLoading(true);
    try {
      const response = await deploymentsApi.analyzeDeployment(targetDeploymentId);
      
      if (response.success && response.data) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          role: 'assistant',
          type: 'analysis_report',
          deploymentId: targetDeploymentId,
          data: response.data
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          role: 'assistant',
          type: 'error',
          text: response.message || 'Failed to analyze deployment'
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        type: 'error',
        text: err.response?.data?.message || err.message || 'An unexpected error occurred during AI analysis'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeploy = async (targetDeploymentId) => {
    try {
      const newDeployment = await deploymentsApi.redeployDeployment(targetDeploymentId);
      onClose();
      navigate(`/dashboard/deployments/${newDeployment._id || newDeployment.id || targetDeploymentId}`);
    } catch (error) {
      console.error("Failed to trigger redeploy:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      type: 'text',
      text: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const historyPayload = messages.map(m => {
      if (m.type === 'text' || m.type === 'error' || m.type === 'failed_deployment_prompt') {
        return {
          role: m.role,
          parts: [{ text: m.text }]
        };
      } else if (m.type === 'analysis_report') {
        return {
          role: 'model',
          parts: [{ text: `Analysis generated: ${JSON.stringify(m.data)}` }]
        };
      }
      return null;
    }).filter(Boolean);

    const contextPayload = {
      type: projectId ? 'project' : deploymentId ? 'deployment' : 'general',
      projectId: projectId || null,
      deploymentId: deploymentId || null
    };

    try {
      const response = await deploymentsApi.chat(userMessage.text, historyPayload, contextPayload);
      if (response.success && response.data) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          role: 'assistant',
          type: 'text',
          text: response.data.text
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          role: 'assistant',
          type: 'error',
          text: response.message || 'Failed to get response'
        }]);
      }
    } catch (err) {
      if (err.response?.status === 429) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          role: 'assistant',
          type: 'text',
          text: "I'm receiving too many requests right now. Please wait a moment and try again."
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          role: 'assistant',
          type: 'error',
          text: err.response?.data?.message || err.message || 'An unexpected error occurred'
        }]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Drawer Animation Classes
  const drawerClasses = `fixed inset-y-0 right-0 z-50 w-full sm:w-[400px] md:w-[450px] bg-card border-l border-border shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`;
  
  if (!isOpen && !contextResolved) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={drawerClasses}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">DeployX AI</h3>
              <p className="text-xs text-muted-foreground">
                {projectContext ? 'Project Context' : deploymentContext ? 'Deployment Context' : 'General Assistant'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              
              {/* Text Message */}
              {msg.type === 'text' && (
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-muted border border-border text-foreground rounded-bl-none'}`}>
                  {msg.text}
                </div>
              )}

              {/* Error Message */}
              {msg.type === 'error' && (
                <div className="max-w-[90%] p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-sm text-rose-400 rounded-bl-none flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{msg.text}</span>
                </div>
              )}

              {/* Failed Deployment Prompt */}
              {msg.type === 'failed_deployment_prompt' && (
                <div className="max-w-[90%] p-4 rounded-2xl bg-muted border border-border text-foreground rounded-bl-none space-y-3">
                  <p className="text-sm">{msg.text}</p>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    iconLeft={<Sparkles className="w-3.5 h-3.5" />}
                    onClick={() => handleAnalyzeDeployment(msg.deploymentId)}
                    disabled={loading}
                  >
                    Analyze Deployment
                  </Button>
                </div>
              )}

              {/* Rich Analysis Report */}
              {msg.type === 'analysis_report' && (
                <div className="max-w-[95%] p-4 rounded-2xl bg-muted border border-indigo-500/20 text-foreground rounded-bl-none space-y-5 shadow-lg">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        Failure Summary
                      </h4>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border capitalize ${
                        msg.data.severity?.toLowerCase() === 'high' ? 'text-rose-400 bg-rose-400/10 border-rose-400/20' : 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20'
                      }`}>
                        {msg.data.severity}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {msg.data.summary}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Root Cause</h4>
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-sm text-rose-300 font-medium">
                      {msg.data.rootCause}
                    </div>
                  </div>

                  {msg.data.fix && msg.data.fix.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Recommended Fix
                      </h4>
                      <ul className="space-y-2">
                        {msg.data.fix.map((step, idx) => (
                          <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                            <span className="text-indigo-400 font-mono mt-0.5">{idx + 1}.</span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {msg.data.commands && msg.data.commands.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-slate-400" />
                        Suggested Commands
                      </h4>
                      <div className="space-y-1.5">
                        {msg.data.commands.map((cmd, idx) => (
                          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg p-2 flex items-center gap-2">
                            <ChevronRight className="w-4 h-4 text-indigo-500 shrink-0" />
                            <code className="text-xs text-slate-300 font-mono break-all">{cmd}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.data.shouldRedeploy && (
                    <div className="pt-2 border-t border-border">
                      <Button 
                        variant="primary" 
                        size="sm" 
                        iconLeft={<RefreshCw className="w-4 h-4" />}
                        onClick={() => handleRedeploy(msg.deploymentId)}
                      >
                        Redeploy Now
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-start">
              <div className="p-3 rounded-2xl bg-muted border border-border text-foreground rounded-bl-none flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-muted/10">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-foreground placeholder:text-muted-foreground"
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || loading}
              className="absolute right-2 p-1.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
