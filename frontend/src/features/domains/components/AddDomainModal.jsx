import { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { domainsApi } from '../api/domainsApi';

export default function AddDomainModal({ isOpen, onClose, projects = [], onSuccess }) {
  const [domain, setDomain] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (projects && projects.length > 0) {
      setSelectedProjectId(projects[0].id || projects[0]._id || '');
    }
  }, [projects]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = domain.trim();
    if (!trimmed) {
      setError('Domain name cannot be empty.');
      return;
    }
    if (!selectedProjectId) {
      setError('Please select a project.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await domainsApi.createDomain(selectedProjectId, trimmed);
      setDomain('');
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to register domain. Please check the hostname and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Domain">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Project Selection */}
        {projects && projects.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground transition-colors">Target Project</label>
            <select 
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full h-10 px-3 py-2 bg-transparent border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              {projects.map((p) => (
                <option key={p.id || p._id} value={p.id || p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <Input
          id="domain-name"
          label="Domain"
          type="text"
          value={domain}
          onChange={(e) => {
            setDomain(e.target.value);
            if (error) setError('');
          }}
          placeholder="e.g. example.com"
          error={error}
          autoFocus
          autoComplete="off"
          disabled={isSubmitting}
        />

        {/* Footer actions */}
        <div className="flex justify-end gap-2.5 pt-4 mt-2 border-t border-border">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Domain'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
