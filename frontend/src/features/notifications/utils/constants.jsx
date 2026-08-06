import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
} from 'lucide-react';

export const INITIAL_MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'success',
    title: 'Deployment Successful',
    message: 'Your project "deployx-frontend" was successfully deployed to production.',
    projectName: 'deployx-frontend',
    commitHash: '7a8f3b2',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // Today (15 mins ago)
    unread: true,
    details: 'Build completed in 1m 24s. All 42 unit tests passed. SSL certificates automatically renewed for deployx.dev domain.',
  },
  {
    id: 'notif-2',
    type: 'warning',
    title: 'High CPU Usage Detected',
    message: 'Your project "analytics-service" is experiencing higher than normal CPU usage (>85%).',
    projectName: 'analytics-service',
    commitHash: 'e49c10d',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // Today (3 hours ago)
    unread: true,
    details: 'Worker node us-east-1a CPU spiked to 88.4%. Consider scaling up instance capacity or checking memory allocation.',
  },
  {
    id: 'notif-3',
    type: 'error',
    title: 'Build Failed on Main Branch',
    message: 'The build for "backend-api" failed during step npm run build with exit code 1.',
    projectName: 'backend-api',
    commitHash: '2c7104e',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // Yesterday (26 hours ago)
    unread: false,
    details: 'SyntaxError: Unexpected token in src/auth/jwt.js at line 42. Check build logs in Deployment Details dashboard.',
  },
  {
    id: 'notif-4',
    type: 'info',
    title: 'New Team Member Joined',
    message: 'Jane Doe (jane@deployx.dev) accepted your organization invitation.',
    projectName: 'Workspace',
    commitHash: 'N/A',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(), // Yesterday (30 hours ago)
    unread: false,
    details: 'Jane Doe was assigned Developer permissions for all production and preview projects.',
  },
  {
    id: 'notif-5',
    type: 'success',
    title: 'Custom Domain Connected',
    message: 'Domain "api.deployx.dev" successfully routed with active TLS/SSL certificate.',
    projectName: 'deployx-api-service',
    commitHash: '9b3f81a',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // Earlier (3 days ago)
    unread: false,
    details: 'DNS CNAME records verified via Cloudflare DNS resolver. Automated Let\'s Encrypt SSL provisioning active.',
  },
  {
    id: 'notif-6',
    type: 'info',
    title: 'Environment Variable Updated',
    message: 'DATABASE_URL environment key updated for project "analytics-worker".',
    projectName: 'analytics-worker',
    commitHash: 'f812d90',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), // Earlier (5 days ago)
    unread: false,
    details: 'Updated by Alex Rivera. Secret value masked in runtime environment configs.',
  },
];

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
