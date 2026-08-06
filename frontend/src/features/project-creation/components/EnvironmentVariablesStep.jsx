import { Key, Plus, Search, X, Eye, EyeOff, Trash2 } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { ENV_TYPES } from '../constants/wizardConstants';

export default function EnvironmentVariablesStep({
  handleAddEnvVar,
  envSearchQuery,
  setEnvSearchQuery,
  filteredEnvVars,
  handleEnvChange,
  handleToggleEnvVisibility,
  handleToggleEnvironmentTarget,
  handleRemoveEnvVar,
}) {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
            <Key className="w-3.5 h-3.5" />
            Step 5 of 6
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Environment Variables
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Set up key-value pairs for secret tokens, API endpoints, and database connection strings across environments.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={handleAddEnvVar}
          iconLeft={<Plus className="w-4 h-4" />}
          className="shadow-md shadow-blue-500/20"
        >
          Add Variable
        </Button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={envSearchQuery}
          onChange={(e) => setEnvSearchQuery(e.target.value)}
          placeholder="Search variables by Key or Value..."
          className="w-full pl-10 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-950/80 dark:border-slate-800 dark:text-slate-100 text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
        {envSearchQuery && (
          <button
            onClick={() => setEnvSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="border border-border rounded-2xl bg-slate-50 dark:bg-slate-950/50 overflow-hidden shadow-inner">
        {filteredEnvVars.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 text-slate-500 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 flex items-center justify-center">
              <Key className="w-6 h-6 text-blue-400" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200">
                {envSearchQuery ? 'No matching variables found' : 'No Environment Variables'}
              </h4>
              <p className="text-xs text-muted-foreground">
                {envSearchQuery
                  ? `No variables match "${envSearchQuery}". Try clearing search query.`
                  : 'Add environment secrets to configure your build or runtime environment.'}
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={envSearchQuery ? () => setEnvSearchQuery('') : handleAddEnvVar}
              className="mt-2 text-xs"
            >
              {envSearchQuery ? 'Clear Search Filter' : '+ Add First Variable'}
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[300px] scrollbar-thin scrollbar-thumb-slate-800">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-4 w-5/12">Key</th>
                  <th className="py-3 px-4 w-4/12">Value</th>
                  <th className="py-3 px-4 w-3/12">Environment Target</th>
                  <th className="py-3 px-3 text-right w-12">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {filteredEnvVars.map((env) => (
                  <tr key={env.id} className="hover:bg-slate-100 dark:hover:bg-slate-900/40 transition-colors group">
                    <td className="py-2.5 px-4 align-top">
                      <input
                        type="text"
                        value={env.key}
                        onChange={(e) => handleEnvChange(env.id, 'key', e.target.value)}
                        placeholder="VARIABLE_KEY"
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-mono text-slate-900 dark:bg-slate-950/80 dark:border-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:border-blue-500 uppercase placeholder:normal-case"
                      />
                    </td>

                    <td className="py-2.5 px-4 align-top">
                      <div className="relative flex items-center">
                        <input
                          type={env.showValue ? 'text' : 'password'}
                          value={env.value}
                          onChange={(e) => handleEnvChange(env.id, 'value', e.target.value)}
                          placeholder="secret_value"
                          className="w-full pl-3 pr-8 py-1.5 rounded-lg bg-white border border-slate-200 font-mono text-slate-900 dark:bg-slate-950/80 dark:border-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleToggleEnvVisibility(env.id)}
                          className="absolute right-2.5 text-slate-500 hover:text-slate-300 transition-colors p-1"
                          title={env.showValue ? 'Hide Secret Value' : 'Show Secret Value'}
                        >
                          {env.showValue ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    <td className="py-2.5 px-4 align-top">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {ENV_TYPES.map((envName) => {
                          const isChecked = env.environments.includes(envName);
                          return (
                            <button
                              key={envName}
                              type="button"
                              onClick={() => handleToggleEnvironmentTarget(env.id, envName)}
                              className={`px-2 py-0.5 rounded text-xs font-semibold border transition-all ${
                                isChecked
                                  ? 'bg-blue-50 border-blue-500/40 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300'
                                  : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:hover:text-slate-300'
                              }`}
                            >
                              {envName}
                            </button>
                          );
                        })}
                      </div>
                    </td>

                    <td className="py-2.5 px-3 text-right align-top">
                      <button
                        type="button"
                        onClick={() => handleRemoveEnvVar(env.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                        title="Delete Variable"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
