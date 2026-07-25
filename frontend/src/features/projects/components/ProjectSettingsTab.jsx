import { Trash2 } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

export default function ProjectSettingsTab({ project, onAction }) {
  return (
    <div className="space-y-6">
      {/* General Settings Card */}
      <Card style={{ padding: '24px', maxWidth: '100%' }}>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          General Settings
        </h3>
        <div className="space-y-4 max-w-md">
          <Input label="Project Name" defaultValue={project?.name} />
          <Input label="Framework Preset" defaultValue={project?.framework || 'React'} />
          <Input label="Root Directory" defaultValue="./" />
          <Button
            variant="primary"
            size="sm"
            onClick={() => onAction && onAction('Save General Settings')}
          >
            Save Changes
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card style={{ padding: '24px', maxWidth: '100%', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">
          Danger Zone
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Permanently delete this project and all associated deployments.
        </p>
        <Button
          variant="danger"
          size="sm"
          iconLeft={<Trash2 className="w-3.5 h-3.5" />}
          onClick={() => onAction && onAction('Delete Project')}
        >
          Delete Project
        </Button>
      </Card>
    </div>
  );
}
