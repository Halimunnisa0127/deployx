import React, { useState, memo } from 'react';
import Button from '../../../components/ui/Button';
import EmptyState from '../../../components/common/EmptyState';
import { Package, Download, Check, FileCode, Archive, Clock } from 'lucide-react';

function BuildArtifactsCard({ deployment }) {
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadedIds, setDownloadedIds] = useState([]);

  if (deployment?.status === 'failed') {
    return (
      <EmptyState
        card={true}
        icon={<Package className="w-6 h-6 text-slate-400" />}
        title="No Build Artifacts"
        description="Artifacts will be generated after a successful build."
      />
    );
  }

  // Default artifacts dataset
  const artifacts = deployment?.artifacts || [
    {
      id: 'art-001',
      name: 'build.zip',
      type: 'ZIP',
      size: '4.2 MB',
      createdTime: 'Created 2 minutes ago',
      icon: Archive,
    },
    {
      id: 'art-002',
      name: 'build-manifest.json',
      type: 'JSON',
      size: '124 KB',
      createdTime: 'Created 2 minutes ago',
      icon: FileCode,
    },
    {
      id: 'art-003',
      name: 'source-maps.tar.gz',
      type: 'TAR.GZ',
      size: '1.8 MB',
      createdTime: 'Created 2 minutes ago',
      icon: Package,
    },
  ];

  const handleDownload = (artifact) => {
    setDownloadingId(artifact.id);
    setTimeout(() => {
      setDownloadingId(null);
      setDownloadedIds((prev) => [...prev, artifact.id]);
      
      const element = document.createElement('a');
      const file = new Blob([`Simulated build artifact content for ${artifact.name}`], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = artifact.name;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 800);
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-6 text-left">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Package className="w-4 h-4 text-emerald-400" />
          Build Artifacts
        </h3>
        <span className="text-xs text-slate-400 font-medium font-mono bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60">
          {artifacts.length} Artifacts Available
        </span>
      </div>

      <div className="divide-y divide-slate-800/60 border border-slate-800/80 rounded-xl overflow-hidden bg-slate-950/40">
        {artifacts.map((artifact) => {
          const IconComponent = artifact.icon || Package;
          const isDownloading = downloadingId === artifact.id;
          const isDownloaded = downloadedIds.includes(artifact.id);

          return (
            <div
              key={artifact.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-900/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
                  <IconComponent className="w-5 h-5" />
                </div>

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-100 truncate font-mono">
                      {artifact.name}
                    </span>
                    <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 uppercase tracking-wider font-mono">
                      {artifact.type}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {artifact.size}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                    <span>{artifact.createdTime}</span>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                <Button
                  variant={isDownloaded ? 'secondary' : 'primary'}
                  size="sm"
                  isLoading={isDownloading}
                  iconLeft={
                    isDownloaded ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )
                  }
                  onClick={() => handleDownload(artifact)}
                  aria-label={`Download ${artifact.name}`}
                >
                  {isDownloaded ? 'Downloaded' : 'Download'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(BuildArtifactsCard);
