import React, { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

export default function AddDomainModal({ isOpen, onClose }) {
  const [domain, setDomain] = useState('');
  const [environment, setEnvironment] = useState('Production');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = domain.trim();
    if (!trimmed) {
      setError('Domain name cannot be empty.');
      return;
    }
    // In a real app we'd dispatch an action here
    setDomain('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Domain">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground transition-colors">Environment</label>
          <select 
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
            className="w-full h-10 px-3 py-2 bg-transparent border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          >
            <option value="Production">Production</option>
            <option value="Preview">Preview</option>
          </select>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-2.5 pt-4 mt-2 border-t border-border">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Add Domain
          </Button>
        </div>
      </form>
    </Modal>
  );
}
