import { Key, Plus } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function ProjectEnvTab({ onAction }) {
  return (
    <Card style={{ padding: '32px', maxWidth: '100%', textAlign: 'center' }}>
      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto mb-3">
        <Key className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-200 mb-1">
        Environment Variables
      </h3>
      <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
        No environment variables configured for this project yet. Add secrets to configure your app at runtime.
      </p>
      <Button
        variant="primary"
        size="sm"
        iconLeft={<Plus className="w-3.5 h-3.5" />}
        onClick={() => onAction && onAction('Add Environment Variable')}
      >
        Add Variable
      </Button>
    </Card>
  );
}
