import { useState } from 'react';
import {
  Settings,
  GitBranch,
  Terminal,
  Key,
  AlertTriangle,
  Trash2,
  RefreshCw,
  Unlink,
  ArrowRightLeft,
  Check,
  ExternalLink,
} from 'lucide-react';

import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';

import { getMockProjectSettings } from '../utils/projectMockData';

export default function ProjectSettingsTab({ project, onAction }) {
  const mockSettings = getMockProjectSettings(project);

  // Form states
  const [generalForm, setGeneralForm] = useState({
    name: mockSettings.name || project?.name || '',
    framework: mockSettings.framework || 'Vite / React',
    rootDirectory: mockSettings.rootDirectory || './',
  });

  const [gitForm, setGitForm] = useState({
    repository: mockSettings.repository || 'github.com/org/repo',
    branch: mockSettings.branch || 'main',
    autoDeploy: true,
  });

  const [buildForm, setBuildForm] = useState({
    buildCommand: mockSettings.buildCommand || 'npm run build',
    outputDirectory: mockSettings.outputDirectory || 'dist',
    installCommand: mockSettings.installCommand || 'npm install',
  });

  // Feedback states
  const [savedGeneral, setSavedGeneral] = useState(false);
  const [savedBuild, setSavedBuild] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Handle General save
  const handleSaveGeneral = (e) => {
    e.preventDefault();
    setSavedGeneral(true);
    if (onAction) onAction('Saved General Settings');
    setTimeout(() => setSavedGeneral(false), 2000);
  };

  // Handle Git Reconnect / Disconnect
  const handleReconnectGit = () => {
    if (onAction) onAction('Reconnected Git repository');
  };

  const handleDisconnectGit = () => {
    if (onAction) onAction('Disconnected Git repository');
  };

  // Handle Build save
  const handleSaveBuild = (e) => {
    e.preventDefault();
    setSavedBuild(true);
    if (onAction) onAction('Saved Build Settings');
    setTimeout(() => setSavedBuild(false), 2000);
  };

  // Handle Delete Project
  const handleDeleteProject = () => {
    if (deleteConfirmText.trim().toLowerCase() === (project?.name || 'app').toLowerCase()) {
      setIsDeleteModalOpen(false);
      if (onAction) onAction(`Deleted project ${project?.name || 'App'}`);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* 1. GENERAL */}
      <Card style={{ padding: '24px', maxWidth: '100%' }}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                General
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure core settings and directory structure for your project.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveGeneral} className="space-y-4 max-w-xl">
          <Input
            label="Project Name"
            value={generalForm.name}
            onChange={(e) => setGeneralForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. My Nextjs Web App"
          />

          <Input
            label="Framework"
            value={generalForm.framework}
            onChange={(e) => setGeneralForm((prev) => ({ ...prev, framework: e.target.value }))}
            placeholder="e.g. Vite / React, Next.js"
          />

          <Input
            label="Root Directory"
            value={generalForm.rootDirectory}
            onChange={(e) => setGeneralForm((prev) => ({ ...prev, rootDirectory: e.target.value }))}
            placeholder="e.g. ./"
            helperText="The directory within your repository where your project code resides."
          />

          <div className="pt-2 flex items-center gap-3">
            <Button type="submit" variant="primary" size="sm">
              {savedGeneral ? 'Saved Changes' : 'Save Changes'}
            </Button>
            {savedGeneral && (
              <span className="text-xs font-semibold text-emerald-400 inline-flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Updated
              </span>
            )}
          </div>
        </form>
      </Card>

      {/* 2. GIT REPOSITORY */}
      <Card style={{ padding: '24px', maxWidth: '100%' }}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Git Repository
                </h2>
                <Badge variant="success" dot={true}>
                  Connected
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage connected git repository, branch, and automatic deployment triggers.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 max-w-xl">
          <Input
            label="Repository"
            value={gitForm.repository}
            onChange={(e) => setGitForm((prev) => ({ ...prev, repository: e.target.value }))}
            placeholder="github.com/org/repo"
          />

          <Input
            label="Branch"
            value={gitForm.branch}
            onChange={(e) => setGitForm((prev) => ({ ...prev, branch: e.target.value }))}
            placeholder="e.g. main or master"
            helperText="Pushes to this branch trigger automatic production builds."
          />

          {/* Auto Deploy Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/60 dark:border-slate-800">
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-200 block">
                Auto Deploy
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Automatically trigger deployments when code is pushed to the target branch.
              </span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={gitForm.autoDeploy}
                onChange={(e) => setGitForm((prev) => ({ ...prev, autoDeploy: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              iconLeft={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={handleReconnectGit}
            >
              Reconnect Repository
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              iconLeft={<Unlink className="w-3.5 h-3.5 text-rose-400" />}
              onClick={handleDisconnectGit}
              style={{ color: '#f87171' }}
            >
              Disconnect
            </Button>
          </div>
        </div>
      </Card>

      {/* 3. BUILD SETTINGS */}
      <Card style={{ padding: '24px', maxWidth: '100%' }}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Build Settings
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Override build commands, output artifact directories, and install scripts.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveBuild} className="space-y-4 max-w-xl">
          <Input
            label="Build Command"
            value={buildForm.buildCommand}
            onChange={(e) => setBuildForm((prev) => ({ ...prev, buildCommand: e.target.value }))}
            placeholder="e.g. npm run build"
          />

          <Input
            label="Output Directory"
            value={buildForm.outputDirectory}
            onChange={(e) => setBuildForm((prev) => ({ ...prev, outputDirectory: e.target.value }))}
            placeholder="e.g. dist or .next"
          />

          <Input
            label="Install Command"
            value={buildForm.installCommand}
            onChange={(e) => setBuildForm((prev) => ({ ...prev, installCommand: e.target.value }))}
            placeholder="e.g. npm install"
          />

          <div className="pt-2 flex items-center gap-3">
            <Button type="submit" variant="primary" size="sm">
              {savedBuild ? 'Saved Build Settings' : 'Save Build Settings'}
            </Button>
            {savedBuild && (
              <span className="text-xs font-semibold text-emerald-400 inline-flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </div>
        </form>
      </Card>

      {/* 4. ENVIRONMENT VARIABLES */}
      <Card style={{ padding: '24px', maxWidth: '100%' }}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Environment Variables
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage environment variables configured for your build and runtime environments.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 max-w-xl">
          <p className="text-xs text-slate-700 dark:text-slate-300">
            Environment variables are encrypted and automatically injected into production and preview deployments.
          </p>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-200 block">
                Project Environment Variables
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Configure API keys, database URLs, and secret tokens.
              </span>
            </div>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              iconRight={<ExternalLink className="w-3.5 h-3.5" />}
              onClick={() => {
                if (onAction) onAction('Opened Environment Variables Manager');
              }}
            >
              Manage Variables
            </Button>
          </div>
        </div>
      </Card>

      {/* 5. DANGER ZONE */}
      <Card
        style={{
          padding: '24px',
          maxWidth: '100%',
          borderColor: 'rgba(239, 68, 68, 0.3)',
          background: 'rgba(239, 68, 68, 0.03)',
        }}
      >
        <div className="flex items-center justify-between pb-3 border-b border-rose-500/20 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-rose-400 tracking-tight">
                Danger Zone
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Irreversible and destructive actions for this project workspace.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Transfer Project Ownership (UI only) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/60 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-200">
                  Transfer Project Ownership
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-600 border border-slate-300 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700">
                  UI Only
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Transfer ownership of this project to another organization or user workspace.
              </p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              iconLeft={<ArrowRightLeft className="w-3.5 h-3.5" />}
              onClick={() => {
                if (onAction) onAction('Transfer Project Ownership initiated');
              }}
            >
              Transfer Project
            </Button>
          </div>

          {/* Delete Project */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-200 block">
                Delete Project
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Permanently remove this project, custom domains, and all deployment history.
              </p>
            </div>

            <Button
              variant="danger"
              size="sm"
              iconLeft={<Trash2 className="w-3.5 h-3.5" />}
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete Project
            </Button>
          </div>
        </div>
      </Card>

      {/* Delete Project Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Project Confirmation"
        maxWidth="460px"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                Warning: This action cannot be undone.
              </p>
              <p>
                Deleting this project will permanently delete all domains, build history, and environment variables.
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300">
            To confirm deletion, please type{' '}
            <strong className="text-slate-900 dark:text-white font-mono bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">
              {project?.name || 'app'}
            </strong>{' '}
            below:
          </p>

          <Input
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder={`Type "${project?.name || 'app'}" to confirm`}
          />

          <div className="pt-2 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="danger"
              size="sm"
              disabled={
                deleteConfirmText.trim().toLowerCase() !== (project?.name || 'app').toLowerCase()
              }
              onClick={handleDeleteProject}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

