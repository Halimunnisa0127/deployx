import { FolderPlus, GitBranch, Rocket } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function EmptyDashboardState({
  title = 'No projects deployed yet',
  description = 'Get started by creating your first project from a GitHub repository or deploying from a template.',
  onNewProject,
  onImportRepo,
}) {
  return (
    <Card style={{ maxWidth: '100%', padding: '48px 24px' }} className="text-center">
      <div className="max-w-md mx-auto space-y-6">
        {/* Icon Circle */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-lg shadow-indigo-500/10">
          <Rocket className="w-8 h-8 text-indigo-400" />
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="primary"
            size="md"
            to={onNewProject ? undefined : '/dashboard/projects/new'}
            onClick={onNewProject}
            iconLeft={<FolderPlus className="w-4 h-4" />}
          >
            Create New Project
          </Button>

          <Button
            variant="secondary"
            size="md"
            to={onImportRepo ? undefined : '/dashboard/projects/import'}
            onClick={onImportRepo}
            iconLeft={<GitBranch className="w-4 h-4" />}
          >
            Import Repository
          </Button>
        </div>
      </div>
    </Card>
  );
}
