import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createProject } from '../slice/projectsSlice';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

export default function CreateProjectModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Project name cannot be empty.');
      return;
    }
    dispatch(createProject({ name: trimmed }));
    setName('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Project">
      <form onSubmit={handleSubmit} noValidate>
        <Input
          id="project-name"
          label="Project name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError('');
          }}
          placeholder="e.g. my-awesome-app"
          error={error}
          autoFocus
          autoComplete="off"
        />

        {/* Footer actions */}
        <div style={footerStyle}>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
}

/* ── Styles ─────────────────────────────────────────────────────── */

const footerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px',
  marginTop: '24px',
};
