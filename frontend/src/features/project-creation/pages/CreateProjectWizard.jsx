import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, ArrowRight, X, Rocket } from 'lucide-react';
import Button from '../../../components/ui/Button';
import {
  createProject,
  checkProjectNameThunk,
  createProjectThunk,
} from '../../projects/slice/projectsSlice';
import DeploymentProgressScreen from '../../deployments/components/DeploymentProgressScreen';

import {
  STEPS,
  FRAMEWORK_OPTIONS,
  FRAMEWORK_PRESETS,
  MOCK_REPOSITORIES,
} from '../constants/wizardConstants';

import {
  WizardStepper,
  ProjectNameStep,
  GithubConnectionStep,
  FrameworkSelectionStep,
  BuildSettingsStep,
  EnvironmentVariablesStep,
  ReviewConfigurationStep,
} from '../components';
import { githubApi } from '../../github/api/githubApi';
import { env } from '../../../config/env';

export default function CreateProjectWizard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [projectName, setProjectName] = useState('');
  const [gitRepository, setGitRepository] = useState('');
  const [branch, setBranch] = useState('main');

  // Step 2 State
  const [isGithubConnected, setIsGithubConnected] = useState(false);
  const [githubUsername, setGithubUsername] = useState('');
  const [isConnectingGithub, setIsConnectingGithub] = useState(false);
  const [repoSearchQuery, setRepoSearchQuery] = useState('');
  const [selectedRepoId, setSelectedRepoId] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [repoBranches, setRepoBranches] = useState([]);

  // Step 3 State
  const [isAutoDetect, setIsAutoDetect] = useState(true);
  const [selectedFramework, setSelectedFramework] = useState('auto');
  const [rootDirectory, setRootDirectory] = useState('/');
  const [selectedRegion, setSelectedRegion] = useState('auto');

  // Step 4 Build Settings State
  const [packageManager, setPackageManager] = useState('npm');
  const [installCommand, setInstallCommand] = useState('npm install');
  const [buildCommand, setBuildCommand] = useState('npm run build');
  const [outputDirectory, setOutputDirectory] = useState('dist');
  const [nodeVersion, setNodeVersion] = useState('20.x');

  // Step 5 Environment Variables State
  const [envSearchQuery, setEnvSearchQuery] = useState('');
  const [envVars, setEnvVars] = useState([
    {
      id: 'env-1',
      key: 'DATABASE_URL',
      value: 'postgresql://admin:secretpass@db.deployx.app:5432/main',
      environments: ['Production', 'Preview', 'Development'],
      showValue: false,
    },
    {
      id: 'env-2',
      key: 'NEXT_PUBLIC_API_URL',
      value: 'https://api.deployx.app/v1',
      environments: ['Production', 'Preview', 'Development'],
      showValue: true,
    },
  ]);

  // Redux state
  const { nameCheck } = useSelector((state) => state.projects || {});

  // Debounced backend check for Step 1 Project Name
  useEffect(() => {
    const trimmed = projectName.trim();
    if (!trimmed) return;

    const timer = setTimeout(() => {
      dispatch(checkProjectNameThunk(trimmed));
    }, 400);

    return () => clearTimeout(timer);
  }, [projectName, dispatch]);

  const fetchRepositories = async () => {
    try {
      const statusObj = await githubApi.checkConnectionStatus();
      const isConnected = !!statusObj;
      setIsGithubConnected(isConnected);
      if (isConnected) {
        setGithubUsername(statusObj.username || '');
        let repos = await githubApi.getRepositories();
        if (!repos || repos.length === 0) {
          // If empty, force a sync since the backend might have not synced yet
          await githubApi.syncRepositories();
          repos = await githubApi.getRepositories();
        }
        setRepositories(repos || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const savedName = sessionStorage.getItem('wizard_project_name');
    const savedStep = sessionStorage.getItem('wizard_step');
    if (savedName) setProjectName(savedName);
    if (savedStep) setCurrentStep(Number(savedStep));
    
    sessionStorage.removeItem('wizard_project_name');
    sessionStorage.removeItem('wizard_step');

    fetchRepositories();
  }, []);

  // Deployment Progress Mode
  const [isDeployingProgress, setIsDeployingProgress] = useState(false);

  // Domain slug generator preview from backend or client fallback
  const projectSlug = projectName.trim()
    ? projectName.toLowerCase().replace(/[^a-z0-9-]/g, '')
    : 'my-project';
  const previewUrl = nameCheck?.previewUrl || `https://${projectSlug}.deployx.app`;

  const selectedRepo = repositories.find((r) => String(r.id) === String(selectedRepoId) || String(r.githubRepositoryId) === String(selectedRepoId));
  const detectedFrameworkKey = (selectedRepo?.detectedFramework || 'React').toLowerCase();
  const detectedFrameworkName = selectedRepo?.detectedFramework || 'React';

  // Auto-fill defaults when framework changes
  useEffect(() => {
    let key = selectedFramework;
    if (selectedFramework === 'auto') {
      if (detectedFrameworkKey.includes('next')) key = 'nextjs';
      else if (detectedFrameworkKey.includes('react')) key = 'react';
      else if (detectedFrameworkKey.includes('vite')) key = 'vite';
      else key = 'react';
    }

    const preset = FRAMEWORK_PRESETS[key] || FRAMEWORK_PRESETS.react;
    setPackageManager(preset.packageManager);
    setInstallCommand(preset.installCommand);
    setBuildCommand(preset.buildCommand);
    setOutputDirectory(preset.outputDirectory);
    setNodeVersion(preset.nodeVersion);
  }, [selectedFramework, selectedRepoId]);

  // Handle Package Manager Change
  const handlePMChange = (pmId) => {
    setPackageManager(pmId);

    if (installCommand.includes('install') || installCommand === 'npm i') {
      setInstallCommand(`${pmId} install`);
    }

    if (
      buildCommand === 'npm run build' ||
      buildCommand === 'pnpm build' ||
      buildCommand === 'yarn build' ||
      buildCommand === 'bun run build'
    ) {
      if (pmId === 'pnpm' || pmId === 'yarn') {
        setBuildCommand(`${pmId} build`);
      } else if (pmId === 'bun') {
        setBuildCommand('bun run build');
      } else {
        setBuildCommand('npm run build');
      }
    }
  };

  // Reset to framework defaults
  const handleResetToDefaults = () => {
    let key = selectedFramework;
    if (selectedFramework === 'auto') {
      if (detectedFrameworkKey.includes('next')) key = 'nextjs';
      else key = 'react';
    }
    const preset = FRAMEWORK_PRESETS[key] || FRAMEWORK_PRESETS.react;
    setPackageManager(preset.packageManager);
    setInstallCommand(preset.installCommand);
    setBuildCommand(preset.buildCommand);
    setOutputDirectory(preset.outputDirectory);
    setNodeVersion(preset.nodeVersion);
  };

  // Step 5 Environment Variables Handlers
  const handleAddEnvVar = () => {
    setEnvVars((prev) => [
      ...prev,
      {
        id: `env-${Date.now()}`,
        key: '',
        value: '',
        environments: ['Production', 'Preview', 'Development'],
        showValue: true,
      },
    ]);
  };

  const handleRemoveEnvVar = (id) => {
    setEnvVars((prev) => prev.filter((env) => env.id !== id));
  };

  const handleEnvChange = (id, field, value) => {
    setEnvVars((prev) =>
      prev.map((env) => (env.id === id ? { ...env, [field]: value } : env))
    );
  };

  const handleToggleEnvVisibility = (id) => {
    setEnvVars((prev) =>
      prev.map((env) =>
        env.id === id ? { ...env, showValue: !env.showValue } : env
      )
    );
  };

  const handleToggleEnvironmentTarget = (id, envName) => {
    setEnvVars((prev) =>
      prev.map((env) => {
        if (env.id !== id) return env;
        const exists = env.environments.includes(envName);
        const updatedEnvs = exists
          ? env.environments.filter((e) => e !== envName)
          : [...env.environments, envName];
        return { ...env, environments: updatedEnvs };
      })
    );
  };

  // Step navigation handlers
  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleFinalDeploy();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinalDeploy = () => {
    const trimmedName = projectName.trim();
    if (!trimmedName) return;

    let finalFramework;
    if (selectedFramework === 'auto') {
      finalFramework = detectedFrameworkName;
    } else {
      const match = FRAMEWORK_OPTIONS.find((f) => f.id === selectedFramework);
      finalFramework = match ? match.name : 'React';
    }

    const payload = {
      name: trimmedName,
      framework: finalFramework,
      gitRepository: {
        url: gitRepository,
        fullName: selectedRepo?.fullName || gitRepository,
        branch: selectedBranch || branch || 'main',
        provider: 'github',
      },
      rootDirectory,
      region: selectedRegion,
      buildSettings: {
        packageManager,
        installCommand,
        buildCommand,
        outputDirectory,
        nodeVersion,
      },
      environmentVariables: envVars.map((e) => ({
        key: e.key,
        value: e.value,
        environments: e.environments,
      })),
    };

    // Dispatch real backend creation thunk and local store fallback
    dispatch(createProjectThunk(payload));
    dispatch(createProject({ name: trimmedName, framework: finalFramework, branch: selectedBranch || branch || 'main' }));

    setIsDeployingProgress(true);
  };

  // GitHub handlers
  const handleConnectGithub = (options = {}) => {
    setIsConnectingGithub(true);
    // Save current wizard state so we can restore it after oauth
    sessionStorage.setItem('wizard_project_name', projectName);
    sessionStorage.setItem('wizard_step', '2');
    
    // Redirect in the same window instead of a popup
    let url = `${env.API_BASE_URL}/integrations/github/oauth/connect`;
    if (options.forceConsent) {
      url += '?prompt=consent';
    }
    window.location.href = url;
  };

  const handleDisconnectGithub = async () => {
    try {
      await githubApi.disconnect();
    } catch (e) {
      console.error(e);
    }
    setIsGithubConnected(false);
    setGithubUsername('');
    setSelectedRepoId('');
    setSelectedBranch('');
  };

  const handleSelectRepo = async (repo) => {
    const repoId = repo.id || repo.githubRepositoryId;
    setSelectedRepoId(repoId);
    setSelectedBranch(repo.defaultBranch);
    setGitRepository(`https://github.com/${repo.fullName}`);
    setBranch(repo.defaultBranch);
    
    // Fetch branches for the selected repo
    setRepoBranches([]);
    try {
      const branches = await githubApi.getBranches(repo.owner, repo.name);
      setRepoBranches(branches);
    } catch (error) {
      console.error('Failed to fetch branches', error);
      // Fallback to default branch
      setRepoBranches([repo.defaultBranch]);
    }
  };

  const handleSelectBranch = (branchName) => {
    setSelectedBranch(branchName);
    setBranch(branchName);
  };

  // Step 3 Framework handlers
  const handleAutoDetectToggle = (enabled) => {
    setIsAutoDetect(enabled);
    if (enabled) {
      setSelectedFramework('auto');
    }
  };

  const handleFrameworkChange = (frameworkId) => {
    setSelectedFramework(frameworkId);
    if (frameworkId === 'auto') {
      setIsAutoDetect(true);
    } else {
      setIsAutoDetect(false);
    }
  };

  // Continue button validation logic per step
  const isContinueDisabled = () => {
    if (currentStep === 1) {
      return !projectName.trim() || nameCheck?.isChecking || nameCheck?.available === false;
    }
    if (currentStep === 2) {
      return !isGithubConnected || !selectedRepoId;
    }
    return false;
  };

  // Filtered repositories for Step 2
  const filteredRepositories = repositories.filter((repo) =>
    (repo.fullName && repo.fullName.toLowerCase().includes(repoSearchQuery.toLowerCase().trim())) ||
    (repo.name && repo.name.toLowerCase().includes(repoSearchQuery.toLowerCase().trim()))
  );

  // Filtered Environment Variables for Step 5
  const filteredEnvVars = envVars.filter(
    (env) =>
      env.key.toLowerCase().includes(envSearchQuery.toLowerCase().trim()) ||
      env.value.toLowerCase().includes(envSearchQuery.toLowerCase().trim())
  );

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans antialiased relative overflow-x-hidden selection:bg-blue-500 selection:text-white">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Navigation Bar */}
      <header className="h-16 px-4 sm:px-8 border-b border-slate-200 bg-white/70 dark:border-slate-800/80 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/projects"
            className="flex items-center gap-2.5 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform">
              DX
            </div>
            <span className="font-bold tracking-tight text-lg text-slate-900 dark:text-slate-100 hidden sm:inline">
              DeployX
            </span>
          </Link>
          <span className="text-slate-400 dark:text-slate-700 hidden sm:inline">/</span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400">
            {isDeployingProgress ? 'Deployment Progress' : 'Create Project'}
          </span>
        </div>

        {!isDeployingProgress && (
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end sm:items-center">
              <span className="text-xs font-semibold text-muted-foreground">
                Step <span className="text-blue-600 dark:text-blue-400 font-bold">{currentStep}</span> of 6
              </span>
              <div className="w-32 sm:w-48 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 ease-out"
                  style={{ width: `${(currentStep / 6) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard/projects')}
          className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60"
          iconLeft={<X className="w-4 h-4" />}
        >
          <span className="hidden sm:inline">Exit</span>
        </Button>
      </header>

      {/* Interactive Stepper Component */}
      {!isDeployingProgress && <WizardStepper currentStep={currentStep} />}

      {/* Main Wizard Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10 z-10">
        {isDeployingProgress ? (
          <DeploymentProgressScreen
            projectName={projectName || 'my-awesome-app'}
            repository={selectedRepo?.fullName || gitRepository || 'acme-corp/deployx-web-app'}
            branch={selectedBranch || branch || 'main'}
            url={previewUrl}
            onCancel={() => setIsDeployingProgress(false)}
          />
        ) : (
          <div className="max-w-3xl w-full bg-white/80 border border-slate-200 dark:bg-slate-900/80 dark:border-slate-800/90 rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-xl flex flex-col justify-between min-h-[520px] transition-all">
            
            {/* STEP 1: PROJECT NAME */}
            {currentStep === 1 && (
              <ProjectNameStep
                projectName={projectName}
                setProjectName={setProjectName}
                previewUrl={previewUrl}
                isCheckingName={nameCheck?.isChecking}
                isAvailable={nameCheck?.available}
                nameError={nameCheck?.error}
              />
            )}

            {/* STEP 2: CONNECT GITHUB REPOSITORY */}
            {currentStep === 2 && (
              <GithubConnectionStep
                isGithubConnected={isGithubConnected}
                githubUsername={githubUsername}
                isConnectingGithub={isConnectingGithub}
                handleConnectGithub={handleConnectGithub}
                handleDisconnectGithub={handleDisconnectGithub}
                repoSearchQuery={repoSearchQuery}
                setRepoSearchQuery={setRepoSearchQuery}
                filteredRepositories={filteredRepositories}
                selectedRepoId={selectedRepoId}
                selectedRepo={selectedRepo}
                selectedBranch={selectedBranch}
                handleSelectRepo={handleSelectRepo}
                handleSelectBranch={handleSelectBranch}
                repoBranches={repoBranches}
              />
            )}

            {/* STEP 3: CONFIGURE PROJECT */}
            {currentStep === 3 && (
              <FrameworkSelectionStep
                isAutoDetect={isAutoDetect}
                handleAutoDetectToggle={handleAutoDetectToggle}
                detectedFrameworkName={detectedFrameworkName}
                selectedFramework={selectedFramework}
                handleFrameworkChange={handleFrameworkChange}
                rootDirectory={rootDirectory}
                setRootDirectory={setRootDirectory}
                selectedRegion={selectedRegion}
                setSelectedRegion={setSelectedRegion}
              />
            )}

            {/* STEP 4: BUILD & OUTPUT SETTINGS */}
            {currentStep === 4 && (
              <BuildSettingsStep
                handleResetToDefaults={handleResetToDefaults}
                selectedFramework={selectedFramework}
                detectedFrameworkName={detectedFrameworkName}
                packageManager={packageManager}
                handlePMChange={handlePMChange}
                installCommand={installCommand}
                setInstallCommand={setInstallCommand}
                buildCommand={buildCommand}
                setBuildCommand={setBuildCommand}
                outputDirectory={outputDirectory}
                setOutputDirectory={setOutputDirectory}
                nodeVersion={nodeVersion}
                setNodeVersion={setNodeVersion}
              />
            )}

            {/* STEP 5: ENVIRONMENT VARIABLES */}
            {currentStep === 5 && (
              <EnvironmentVariablesStep
                handleAddEnvVar={handleAddEnvVar}
                envSearchQuery={envSearchQuery}
                setEnvSearchQuery={setEnvSearchQuery}
                filteredEnvVars={filteredEnvVars}
                handleEnvChange={handleEnvChange}
                handleToggleEnvVisibility={handleToggleEnvVisibility}
                handleToggleEnvironmentTarget={handleToggleEnvironmentTarget}
                handleRemoveEnvVar={handleRemoveEnvVar}
              />
            )}

            {/* STEP 6: REVIEW CONFIGURATION */}
            {currentStep === 6 && (
              <ReviewConfigurationStep
                projectName={projectName}
                selectedRepo={selectedRepo}
                gitRepository={gitRepository}
                selectedBranch={selectedBranch}
                branch={branch}
                previewUrl={previewUrl}
                selectedFramework={selectedFramework}
                detectedFrameworkName={detectedFrameworkName}
                rootDirectory={rootDirectory}
                nodeVersion={nodeVersion}
                packageManager={packageManager}
                installCommand={installCommand}
                buildCommand={buildCommand}
                outputDirectory={outputDirectory}
                envVars={envVars}
              />
            )}

            {/* Footer Action Buttons */}
            <div className="pt-8 mt-6 border-t border-border flex items-center justify-between gap-4">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={handleBack}
                  iconLeft={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
              ) : (
                <div />
              )}

              <Button
                type="button"
                variant="primary"
                size="md"
                disabled={isContinueDisabled()}
                onClick={handleNext}
                className="shadow-lg shadow-blue-500/20"
              >
                {currentStep === 6 ? (
                  <span className="flex items-center gap-2">
                    <Rocket className="w-4 h-4" />
                    Deploy
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
