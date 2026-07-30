import React, { useState } from 'react';
import DeploymentRow from './DeploymentRow';
import Button from '../../../../components/ui/Button';

export default function DeploymentsTable({ deployments = [], onRowClick, actionHandlers }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(deployments.length / itemsPerPage);
  const paginatedData = deployments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (!deployments.length) return null;

  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 overflow-hidden shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800/80 sticky top-0 z-10 backdrop-blur-xl">
            <tr>
              <th className="px-5 py-3 font-medium">Deployment</th>
              <th className="px-5 py-3 font-medium">Owner</th>
              <th className="px-5 py-3 font-medium">Framework</th>
              <th className="px-5 py-3 font-medium">Environment</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Duration</th>
              <th className="px-5 py-3 font-medium">Created Time</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {paginatedData.map((deployment) => (
              <DeploymentRow 
                key={deployment.id} 
                deployment={deployment} 
                onRowClick={onRowClick}
                {...actionHandlers}
              />
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="px-5 py-4 border-t border-slate-800/80 flex items-center justify-between text-sm bg-slate-900/40">
          <span className="text-slate-400">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, deployments.length)} of {deployments.length}
          </span>
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
