import { FolderPlus, GitBranch, Rocket, Layers, Activity } from 'lucide-react';
import EmptyState from '../../../components/common/EmptyState';

const EMPTY_STATE_PRESETS = {
  projects: {
    icon: <Rocket className="w-8 h-8 text-indigo-400" />,
    title: 'No projects deployed yet',
    description: 'Get started by creating your first project from a GitHub repository or deploying from a template.',
    primaryAction: {
      label: 'Create New Project',
      to: '/dashboard/projects/new',
      icon: <FolderPlus className="w-4 h-4" />,
    },
    secondaryAction: {
      label: 'Import Repository',
      to: '/dashboard/projects/import',
      icon: <GitBranch className="w-4 h-4" />,
    },
  },
  deployments: {
    icon: <Layers className="w-8 h-8 text-indigo-400" />,
    title: 'No recent deployments',
    description: 'Deployments will automatically appear here when builds are triggered from your Git commits.',
    primaryAction: {
      label: 'Trigger New Build',
      to: '/dashboard/projects',
      icon: <Rocket className="w-4 h-4" />,
    },
  },
  activity: {
    icon: <Activity className="w-8 h-8 text-sky-400" />,
    title: 'No recent activity recorded',
    description: 'Activity history like deployments, domain connections, and team invites will appear here.',
  },
};

export default function EmptyDashboardState({
  type = 'projects',
  title,
  description,
  onNewProject,
  onImportRepo,
  card = true,
}) {
  const preset = EMPTY_STATE_PRESETS[type] || EMPTY_STATE_PRESETS.projects;

  const finalTitle = title || preset.title;
  const finalDescription = description || preset.description;

  const primaryActionConfig = preset.primaryAction
    ? {
        label: preset.primaryAction.label,
        onClick: onNewProject,
        icon: preset.primaryAction.icon,
      }
    : null;

  const secondaryActionConfig = preset.secondaryAction
    ? {
        label: preset.secondaryAction.label,
        onClick: onImportRepo,
        icon: preset.secondaryAction.icon,
      }
    : null;

  return (
    <EmptyState
      icon={preset.icon}
      title={finalTitle}
      description={finalDescription}
      primaryAction={primaryActionConfig}
      secondaryAction={secondaryActionConfig}
      card={card}
    />
  );
}

