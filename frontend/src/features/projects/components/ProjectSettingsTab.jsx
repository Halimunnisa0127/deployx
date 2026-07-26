import { useState } from 'react';
import {
  Settings,
  GitBranch,
  Terminal,
  AlertTriangle,
  Trash2,
  RefreshCw,
  Unlink,
  ArrowRightLeft,
  Check,
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
    name: mockSettings.name,
    description: mockSettings.description,
    framework: mockSettings.framework,
  });

  const [githubForm, setGithubForm] = useState({
    repository: mockSettings.repository,
    branch: mockSettings.branch,
  });

  const [buildForm, setBuildForm] = useState({
    installCommand: mockSettings.installCommand,
    buildCommand: mockSettings.buildCommand,
    outputDirectory: mockSettings.outputDirectory,
    rootDirectory: mockSettings.rootDirectory,
    nodeVersion: mockSettings.nodeVersion,
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

  // Handle GitHub Reconnect / Disconnect
  const handleReconnectGitHub = () => {
    if (onAction) onAction('Reconnected GitHub repository');
  };

  const handleDisconnectGitHub = () => {
    if (onAction) onAction('Disconnected GitHub repository');
  };

  // Handle Build save
  const handleSaveBuild = (e) => {
    e.preventDefault();
    setSavedBuild(true);
    if (onAction) onAction('Saved Build & Development Settings');
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
      {/* 1. GENERAL SETTINGS */}
      <Card style={{ padding: '24px', maxWidth: '100%' }}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 tracking-tight">
                General Settings
              </h2>
              <p className="text-xs text-slate-400">
                Update basic information and preset configurations for your project.
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
            label="Description"
            value={generalForm.description}
            onChange={(e) => setGeneralForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Brief project description..."
          />

          <Input
            label="Framework Preset"
            value={generalForm.framework}
            onChange={(e) => setGeneralForm((prev) => ({ ...prev, framework: e.target.value }))}
            placeholder="e.g. Vite / React, Next.js, Remix"
          />

          <div className="pt-2 flex items-center gap-3">
            <Button type="submit" variant="primary" size="sm">
              {savedGeneral ? 'Saved General Settings' : 'Save Changes'}
            </Button>
            {savedGeneral && (
              <span className="text-xs font-semibold text-emerald-400 inline-flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Updated
              </span>
            )}
          </div>
        </form>
      </Card>

      {/* 2. GITHUB SETTINGS */}
      <Card style={{ padding: '24px', maxWidth: '100%' }}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100 tracking-tight">
                  GitHub Integration
                </h2>
                <Badge variant="success" dot={true}>
                  Connected
                </Badge>
              </div>
              <p className="text-xs text-slate-400">
                Manage connected git repository and automated deployment trigger branch.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 max-w-xl">
          <Input
            label="Repository"
            value={githubForm.repository}
            onChange={(e) => setGithubForm((prev) => ({ ...prev, repository: e.target.value }))}
            placeholder="github.com/org/repo"
          />

          <Input
            label="Production Branch"
            value={githubForm.branch}
            onChange={(e) => setGithubForm((prev) => ({ ...prev, branch: e.target.value }))}
            placeholder="e.g. main or master"
            helperText="Pushes to this branch trigger automatic production builds."
          />

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              iconLeft={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={handleReconnectGitHub}
            >
              Reconnect Repository
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              iconLeft={<Unlink className="w-3.5 h-3.5 text-rose-400" />}
              onClick={handleDisconnectGitHub}
              style={{ color: '#f87171' }}
            >
              Disconnect
            </Button>
          </div>
        </div>
      </Card>

      {/* 3. BUILD SETTINGS */}
      <Card style={{ padding: '24px', maxWidth: '100%' }}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 tracking-tight">
                Build & Development Settings
              </h2>
              <p className="text-xs text-slate-400">
                Override build commands, output artifact directories, and runtime engines.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveBuild} className="space-y-4 max-w-xl">
          <Input
            label="Install Command"
            value={buildForm.installCommand}
            onChange={(e) => setBuildForm((prev) => ({ ...prev, installCommand: e.target.value }))}
            placeholder="e.g. npm install"
          />

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
            label="Root Directory"
            value={buildForm.rootDirectory}
            onChange={(e) => setBuildForm((prev) => ({ ...prev, rootDirectory: e.target.value }))}
            placeholder="e.g. ./"
          />

          <Input
            label="Node.js Version"
            value={buildForm.nodeVersion}
            onChange={(e) => setBuildForm((prev) => ({ ...prev, nodeVersion: e.target.value }))}
            placeholder="e.g. 20.x or 18.x"
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

      {/* 4. DANGER ZONE */}
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
              <p className="text-xs text-slate-400">
                Irreversible and destructive actions for this project workspace.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Transfer Project (Disabled Placeholder) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-200">
                  Transfer Project Ownership
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-500 border border-slate-700">
                  Disabled
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Transfer ownership of this project to another organization or user team.
              </p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              disabled={true}
              iconLeft={<ArrowRightLeft className="w-3.5 h-3.5" />}
            >
              Transfer Project (Disabled)
            </Button>
          </div>

          {/* Delete Project */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
            <div>
              <span className="text-xs font-bold text-slate-200 block">
                Delete Project
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
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
              <p className="font-semibold text-slate-100 mb-1">
                Warning: This action cannot be undone.
              </p>
              <p>
                Deleting this project will permanently delete all domains, build history, and environment variables.
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300">
            To confirm deletion, please type{' '}
            <strong className="text-white font-mono bg-slate-800 px-1.5 py-0.5 rounded">
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

