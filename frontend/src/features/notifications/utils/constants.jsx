import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
} from 'lucide-react';

// Deprecated mock array
export const INITIAL_MOCK_NOTIFICATIONS = [];

export const NOTIFICATION_ICONS = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
  error: <XCircle className="w-5 h-5 text-rose-400" />,
  failed: <XCircle className="w-5 h-5 text-rose-400" />,
  critical: <XCircle className="w-5 h-5 text-rose-600" />,
  info: <Info className="w-5 h-5 text-indigo-400" />,
};

export const BADGE_VARIANTS = {
  success: 'success',
  warning: 'warning',
  error: 'danger',
  failed: 'danger',
  critical: 'danger',
  info: 'info',
};

import { CATEGORIES, PRIORITIES } from '../types';

export const FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: PRIORITIES.SUCCESS, label: 'Success' },
  { id: PRIORITIES.MEDIUM, label: 'Warning' },
  { id: 'failed', label: 'Failed' },
  { id: PRIORITIES.LOW, label: 'Info' },
  { id: 'archived', label: 'Archived' },
  // Domain/Category filters
  { id: CATEGORIES.USER, label: 'Users' },
  { id: CATEGORIES.PROJECT, label: 'Projects' },
  { id: CATEGORIES.DEPLOYMENT, label: 'Deployments' },
  { id: CATEGORIES.DOMAIN, label: 'Domains' },
  { id: CATEGORIES.BILLING, label: 'Billing' },
  { id: CATEGORIES.INFRASTRUCTURE, label: 'Infrastructure' },
  { id: CATEGORIES.SECURITY, label: 'Security' },
  { id: CATEGORIES.GITHUB, label: 'GitHub' },
  { id: 'environment variables', label: 'Environment Variables' },
  { id: CATEGORIES.SYSTEM, label: 'System' },
  { id: CATEGORIES.PLATFORM_HEALTH, label: 'Platform Health' },
  { id: CATEGORIES.AI, label: 'AI' },
];
