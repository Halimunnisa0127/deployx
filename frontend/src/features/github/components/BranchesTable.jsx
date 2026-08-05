import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { GitBranch, Rocket, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function BranchesTable({ branches, onDeploy }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'failed': return <XCircle className="w-4 h-4 text-rose-400" />;
      case 'building': return <Clock className="w-4 h-4 text-amber-400" />;
      default: return <div className="w-4 h-4 rounded-full bg-muted-foreground" />;
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Table>
      <TableHeader>
        <tr>
          <TableHead>Branch Name</TableHead>
          <TableHead>Last Commit</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </tr>
      </TableHeader>
      <TableBody>
        {branches.map((branch) => (
          <TableRow key={branch.id} hover={true}>
            <TableCell>
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-foreground">{branch.name}</span>
                {branch.isDefault && (
                  <Badge variant="neutral" className="uppercase text-xs px-1.5 py-0">Default</Badge>
                )}
              </div>
            </TableCell>
            <TableCell>
              <span className="font-mono text-xs text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md">
                {branch.lastCommit}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-foreground text-sm">{branch.author}</span>
            </TableCell>
            <TableCell>
              <span className="text-muted-foreground text-sm">{formatDate(branch.lastUpdated)}</span>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {getStatusIcon(branch.deploymentStatus)}
                <span className="text-xs text-muted-foreground capitalize">{branch.deploymentStatus}</span>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Button 
                variant="secondary" 
                size="sm" 
                iconLeft={<Rocket className="w-3.5 h-3.5" />}
                onClick={() => onDeploy(branch)}
              >
                Deploy
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
