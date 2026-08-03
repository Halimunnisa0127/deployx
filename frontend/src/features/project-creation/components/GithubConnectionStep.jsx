import { GitBranch, ShieldCheck, CheckCircle2, Lock, Unlock, Search, X, Check } from 'lucide-react';
import Button from '../../../components/ui/Button';
import GithubIcon from '../../../components/ui/GithubIcon';

export default function GithubConnectionStep({
  isGithubConnected,
  isConnectingGithub,
  handleConnectGithub,
  handleDisconnectGithub,
  repoSearchQuery,
  setRepoSearchQuery,
  filteredRepositories,
  selectedRepoId,
  selectedRepo,
  selectedBranch,
  handleSelectRepo,
  handleSelectBranch,
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
          <GitBranch className="w-3.5 h-3.5" />
          Step 2 of 6
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Connect GitHub Repository
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Select a repository from your connected GitHub account to deploy continuous builds.
        </p>
      </div>

      {!isGithubConnected ? (
        <div className="space-y-6 pt-2">
          <div className="bg-slate-50 border border-slate-200 dark:bg-slate-950/60 dark:border-slate-800/90 rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center justify-center space-y-4 shadow-inner relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 dark:from-slate-900 dark:to-slate-950 dark:border-slate-700/80 flex items-center justify-center shadow-xl text-slate-900 dark:text-slate-100 group-hover:scale-105 transition-transform duration-300">
                <GithubIcon className="w-10 h-10 text-slate-800 dark:text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-blue-600 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white shadow-md">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="max-w-sm space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Connect your GitHub Account
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                DeployX requires authorization to import repositories and set up automatic deployment webhooks.
              </p>
            </div>

            <Button
              type="button"
              variant="oauth"
              size="lg"
              isLoading={isConnectingGithub}
              onClick={handleConnectGithub}
              iconLeft={<GithubIcon className="w-5 h-5" />}
              className="px-6 py-3 font-semibold text-sm shadow-xl hover:border-slate-600"
            >
              Connect GitHub Account
            </Button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950/40 dark:border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Permissions requested by DeployX:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900/50 p-2 rounded-lg border border-slate-200 dark:border-slate-800/50">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Read access to code & repos</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900/50 p-2 rounded-lg border border-slate-200 dark:border-slate-800/50">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Webhook creation for builds</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900/50 p-2 rounded-lg border border-slate-200 dark:border-slate-800/50">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Commit status notifications</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900/50 p-2 rounded-lg border border-slate-200 dark:border-slate-800/50">
                <Lock className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span>OAuth token encrypted</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 pt-1">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950/60 dark:border-slate-800/80 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200">
                <GithubIcon className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 dark:text-slate-200">@acme-developer</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Connected
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDisconnectGithub}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-red-400 transition-colors font-medium"
            >
              Disconnect
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={repoSearchQuery}
              onChange={(e) => setRepoSearchQuery(e.target.value)}
              placeholder="Search repositories by name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 dark:bg-slate-950/80 dark:border-slate-800 dark:text-slate-100 text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {repoSearchQuery && (
              <button
                onClick={() => setRepoSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
            {filteredRepositories.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 border border-slate-200 dark:bg-slate-950/40 dark:border-slate-800/80 rounded-xl space-y-2">
                <p className="text-xs text-slate-500 dark:text-slate-400">No repositories found matching "{repoSearchQuery}"</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRepoSearchQuery('')}
                  className="text-xs text-blue-400"
                >
                  Clear Search
                </Button>
              </div>
            ) : (
              filteredRepositories.map((repo) => {
                const isSelected = selectedRepoId === repo.id;
                return (
                  <div
                    key={repo.id}
                    onClick={() => handleSelectRepo(repo)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 text-slate-900 dark:bg-blue-500/10 dark:text-slate-100 shadow-md ring-1 ring-blue-500/30'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-100 dark:bg-slate-950/50 dark:border-slate-800/90 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-950/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <GithubIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="font-semibold text-sm truncate text-slate-900 dark:text-slate-100">
                          {repo.fullName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded-md text-xs font-semibold border flex items-center gap-1 ${
                            repo.visibility === 'Private'
                              ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          {repo.visibility === 'Private' ? (
                            <Lock className="w-2.5 h-2.5" />
                          ) : (
                            <Unlock className="w-2.5 h-2.5" />
                          )}
                          {repo.visibility}
                        </span>

                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-blue-500 border-blue-500 text-white'
                              : 'border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 pt-0.5 flex-wrap">
                      <span className="flex items-center gap-1 font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 dark:text-slate-300 dark:bg-slate-900 dark:border-slate-800">
                        <GitBranch className="w-3 h-3 text-blue-400" />
                        Default: {repo.defaultBranch}
                      </span>
                      <span>{repo.lastUpdated}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-500 dark:text-slate-400 font-medium">{repo.language}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {selectedRepo && (
            <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200 dark:bg-slate-950/80 dark:border-blue-500/30 space-y-2.5 animate-fade-in">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-blue-400" />
                  <span>Selected Branch to Deploy:</span>
                </label>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                  Repo: {selectedRepo.name}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {selectedRepo.branches.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => handleSelectBranch(b)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                      selectedBranch === b
                        ? 'bg-blue-500 text-white border-blue-500 font-semibold shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:border-slate-700'
                    }`}
                  >
                    {b} {b === selectedRepo.defaultBranch && '(default)'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
