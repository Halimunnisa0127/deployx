import { useState, useMemo } from 'react';
import {
  Key,
  Plus,
  Eye,
  EyeOff,
  Copy,
  Check,
  Edit2,
  Trash2,
  CopyPlus,
  ShieldCheck,
  Lock,
} from 'lucide-react';

import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import SearchBar from '../../../components/common/SearchBar';
import EmptyState from '../../../components/common/EmptyState';
import { getMockEnvVariables } from '../utils/projectMockData';

const ENV_BADGE_VARIANTS = {
  Production: 'info',
  Preview: 'warning',
  Development: 'neutral',
  All: 'success',
};

export default function ProjectEnvTab({ project, onAction }) {
  // Initialize local state with mock data
  const [envVars, setEnvVars] = useState(() => getMockEnvVariables(project));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnv, setSelectedEnv] = useState('All');

  // Track revealed state for individual secret values
  const [revealedIds, setRevealedIds] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null if adding new
  const [formData, setFormData] = useState({ key: '', value: '', environment: 'Production' });
  const [formError, setFormError] = useState('');

  // Search & Environment Filter
  const filteredVars = useMemo(() => {
    return envVars.filter((item) => {
      const matchesSearch = item.key.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesEnv = selectedEnv === 'All' || item.environment === selectedEnv || item.environment === 'All';
      return matchesSearch && matchesEnv;
    });
  }, [envVars, searchQuery, selectedEnv]);

  // Toggle secret visibility
  const toggleReveal = (id) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Copy secret value to clipboard
  const handleCopyValue = (id, value) => {
    navigator.clipboard.writeText(value);
    setCopiedId(id);
    if (onAction) onAction('Copied secret value to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Open modal for Adding new variable
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({ key: '', value: '', environment: 'Production' });
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal for Editing variable
  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({ key: item.key, value: item.value, environment: item.environment });
    setFormError('');
    setIsModalOpen(true);
  };

  // Duplicate variable
  const handleDuplicate = (item) => {
    const newKey = `${item.key}_COPY`;
    const newVar = {
      id: `env-${Date.now()}`,
      key: newKey,
      value: item.value,
      environment: item.environment,
      updatedAt: 'Just now',
    };
    setEnvVars((prev) => [newVar, ...prev]);
    if (onAction) onAction(`Duplicated environment variable ${item.key}`);
  };

  // Delete variable
  const handleDelete = (id, key) => {
    setEnvVars((prev) => prev.filter((item) => item.id !== id));
    if (onAction) onAction(`Deleted environment variable ${key}`);
  };

  // Save (Add or Edit) submit handler
  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.key.trim()) {
      setFormError('Key name is required.');
      return;
    }

    const formattedKey = formData.key.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_');

    if (editingItem) {
      // Update existing
      setEnvVars((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? { ...item, key: formattedKey, value: formData.value, environment: formData.environment, updatedAt: 'Just now' }
            : item
        )
      );
      if (onAction) onAction(`Updated environment variable ${formattedKey}`);
    } else {
      // Add new
      const newVar = {
        id: `env-${Date.now()}`,
        key: formattedKey,
        value: formData.value,
        environment: formData.environment,
        updatedAt: 'Just now',
      };
      setEnvVars((prev) => [newVar, ...prev]);
      if (onAction) onAction(`Added environment variable ${formattedKey}`);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Toolbar Card */}
      <Card style={{ padding: '24px', maxWidth: '100%' }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100 tracking-tight">
                  Environment Variables
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3" /> Encrypted & Masked
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Set configuration secrets and runtime variables for your deployments.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            iconLeft={<Plus className="w-4 h-4" />}
            onClick={handleOpenAddModal}
          >
            Add Variable
          </Button>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            placeholder="Search keys..."
            fullWidth={false}
            className="w-full sm:w-72"
          />

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800 overflow-x-auto">
            {['All', 'Production', 'Preview', 'Development'].map((env) => (
              <button
                key={env}
                onClick={() => setSelectedEnv(env)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedEnv === env
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {env}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Production-Ready Variables Table */}
      <Card style={{ padding: '0px', maxWidth: '100%', overflow: 'hidden' }}>
        <div className="overflow-x-auto w-full scrollbar-thin">
          <table className="w-full min-w-[640px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase text-[11px] tracking-wider font-semibold">
                <th className="py-3.5 px-6">Key</th>
                <th className="py-3.5 px-6">Value (Masked)</th>
                <th className="py-3.5 px-6">Environment</th>
                <th className="py-3.5 px-6">Updated</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredVars.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-6">
                    <EmptyState
                      card={false}
                      icon={<Key className="w-6 h-6 text-indigo-400" />}
                      title="No environment variables found"
                      description={
                        searchQuery
                          ? `No environment variable matching "${searchQuery}"`
                          : `No variables configured for ${selectedEnv} environment scope.`
                      }
                      actionLabel="Add Variable"
                      actionIcon={<Plus className="w-4 h-4" />}
                      onActionClick={handleOpenAddModal}
                    />
                  </td>
                </tr>
              ) : (
                filteredVars.map((item) => {
                  const isRevealed = !!revealedIds[item.id];
                  const isCopied = copiedId === item.id;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      {/* KEY */}
                      <td className="py-4 px-6 font-mono font-semibold text-slate-100">
                        <div className="flex items-center gap-2">
                          <Lock className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                          <span className="truncate">{item.key}</span>
                        </div>
                      </td>

                      {/* VALUE (Masked) */}
                      <td className="py-4 px-6 font-mono">
                        <div className="flex items-center gap-2 max-w-xs">
                          <span className="truncate bg-slate-900 px-2.5 py-1 rounded border border-slate-800 text-slate-300 font-mono text-[11px]">
                            {isRevealed ? item.value : '••••••••••••••••'}
                          </span>

                          <button
                            type="button"
                            onClick={() => toggleReveal(item.id)}
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                            title={isRevealed ? 'Mask secret' : 'Reveal secret'}
                          >
                            {isRevealed ? (
                              <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyValue(item.id, item.value)}
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                            title="Copy secret"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* ENVIRONMENT */}
                      <td className="py-4 px-6">
                        <Badge
                          variant={ENV_BADGE_VARIANTS[item.environment] || 'neutral'}
                          dot={true}
                        >
                          {item.environment}
                        </Badge>
                      </td>

                      {/* UPDATED */}
                      <td className="py-4 px-6 text-slate-400 text-[11px]">
                        {item.updatedAt}
                      </td>

                      {/* ACTIONS */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            iconOnly={true}
                            onClick={() => handleOpenEditModal(item)}
                            title="Edit Variable"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            iconOnly={true}
                            onClick={() => handleDuplicate(item)}
                            title="Duplicate Variable"
                          >
                            <CopyPlus className="w-3.5 h-3.5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            iconOnly={true}
                            onClick={() => handleDelete(item.id, item.key)}
                            title="Delete Variable"
                            style={{ color: '#f87171' }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add / Edit Variable Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Environment Variable' : 'Add Environment Variable'}
        maxWidth="500px"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Variable Key"
            placeholder="e.g. DATABASE_URL"
            value={formData.key}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                key: e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_'),
              }))
            }
            error={formError}
            helperText="Uppercase alphanumeric characters and underscores only."
          />

          <Input
            label="Value"
            placeholder="Enter variable secret value..."
            value={formData.value}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, value: e.target.value }))
            }
            helperText="Value will be stored securely and masked by default."
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Environment Scope
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Production', 'Preview', 'Development', 'All'].map((env) => (
                <button
                  type="button"
                  key={env}
                  onClick={() => setFormData((prev) => ({ ...prev, environment: env }))}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                    formData.environment === env
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {env}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingItem ? 'Save Changes' : 'Add Variable'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

