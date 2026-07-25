import { Globe, Plus } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';

export default function ProjectDomainsTab({ defaultUrl, onAction }) {
  return (
    <div className="space-y-4">
      {/* Primary Production Domain */}
      <Card style={{ padding: '24px', maxWidth: '100%' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Production Domain
              </span>
              <span className="text-sm font-bold text-slate-100">{defaultUrl}</span>
            </div>
          </div>
          <Badge variant="success">Active SSL</Badge>
        </div>
      </Card>

      {/* Custom Domains Management */}
      <Card style={{ padding: '24px', maxWidth: '100%' }}>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Custom Domains
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Connect custom domain names to your DeployX project.
        </p>
        <Button
          variant="secondary"
          size="sm"
          iconLeft={<Plus className="w-3.5 h-3.5" />}
          onClick={() => onAction && onAction('Add Custom Domain')}
        >
          Add Custom Domain
        </Button>
      </Card>
    </div>
  );
}
