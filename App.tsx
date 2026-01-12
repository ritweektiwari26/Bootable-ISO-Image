
import React, { useState, useCallback } from 'react';
import { 
  Monitor, 
  Settings, 
  FileCode, 
  Download, 
  Terminal as TerminalIcon, 
  Plus, 
  Trash2, 
  Sparkles,
  Info,
  Layers,
  CheckCircle2,
  Zap,
  Server,
  Layout,
  Cloud
} from 'lucide-react';
import { OS, Arch, ISOConfig, GeneratedFile, BuildLog } from './types';
import { generateISOBlueprint } from './services/geminiService';
import Terminal from './components/Terminal';
import FileTabs from './components/FileTabs';

const TEMPLATES = [
  {
    id: 'ubuntu-server',
    name: 'Ubuntu Server',
    description: 'Minimal, secure server footprint',
    icon: <Server className="w-5 h-5" />,
    color: 'border-orange-500/50 text-orange-400 bg-orange-500/5',
    config: {
      os: OS.UBUNTU,
      version: '24.04 LTS',
      architecture: Arch.X86_64,
      hostname: 'ubuntu-srv',
      username: 'sysadmin',
      packages: ['openssh-server', 'htop', 'curl', 'ufw', 'fail2ban'],
      customScripts: 'Enable UFW and allow port 22 by default. Set up a basic hardening script.',
      isCloudInitEnabled: true
    }
  },
  {
    id: 'debian-desktop',
    name: 'Debian Workstation',
    description: 'GNOME desktop with productivity tools',
    icon: <Layout className="w-5 h-5" />,
    color: 'border-pink-500/50 text-pink-400 bg-pink-500/5',
    config: {
      os: OS.DEBIAN,
      version: '12 (Bookworm)',
      architecture: Arch.X86_64,
      hostname: 'debian-work',
      username: 'user',
      packages: ['task-gnome-desktop', 'firefox-esr', 'libreoffice', 'vlc', 'git'],
      customScripts: 'Install non-free firmware and configure desktop environment scaling for 4K.',
      isCloudInitEnabled: false
    }
  },
  {
    id: 'fedora-cloud',
    name: 'Fedora Cloud-Init',
    description: 'Cloud-ready instance for AWS/GCP',
    icon: <Cloud className="w-5 h-5" />,
    color: 'border-blue-500/50 text-blue-400 bg-blue-500/5',
    config: {
      os: OS.FEDORA,
      version: '40',
      architecture: Arch.X86_64,
      hostname: 'fedora-cloud-node',
      username: 'fedora',
      packages: ['python3', 'dnf-plugins-core', 'qemu-guest-agent', 'cockpit'],
      customScripts: 'Configure cockpit for remote management and optimize swap settings for cloud instances.',
      isCloudInitEnabled: true
    }
  }
];

const App: React.FC = () => {
  const [config, setConfig] = useState<ISOConfig>({
    os: OS.UBUNTU,
    version: '24.04 LTS',
    architecture: Arch.X86_64,
    hostname: 'isoforge-node',
    username: 'admin',
    packages: ['vim', 'curl', 'docker.io', 'git'],
    customScripts: '',
    isCloudInitEnabled: true
  });

  const [newPackage, setNewPackage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [logs, setLogs] = useState<BuildLog[]>([]);
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
  const [activeStep, setActiveStep] = useState(1);

  const addLog = (message: string, type: BuildLog['type'] = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, message, type }]);
  };

  const loadTemplate = (templateConfig: ISOConfig) => {
    setConfig(templateConfig);
    setGeneratedFiles([]);
    setLogs([]);
    addLog(`Loaded ${templateConfig.os} template configuration.`, 'info');
  };

  const addPackage = () => {
    if (newPackage && !config.packages.includes(newPackage)) {
      setConfig(prev => ({ ...prev, packages: [...prev.packages, newPackage] }));
      setNewPackage('');
    }
  };

  const removePackage = (pkg: string) => {
    setConfig(prev => ({ ...prev, packages: prev.packages.filter(p => p !== pkg) }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedFiles([]);
    setLogs([]);
    addLog('Initializing ISOForge AI engine...', 'info');
    addLog(`Target Distribution: ${config.os} ${config.version}`, 'info');
    
    try {
      addLog('Consulting AI Architect for optimal partitioning and package dependencies...', 'info');
      const files = await generateISOBlueprint(config);
      
      await new Promise(r => setTimeout(r, 800));
      addLog('Analyzing package manifest...', 'info');
      await new Promise(r => setTimeout(r, 600));
      addLog('Drafting autoinstall/preseed configurations...', 'info');
      await new Promise(r => setTimeout(r, 1000));
      addLog('Synthesizing bootloader menu and kernel parameters...', 'info');
      
      setGeneratedFiles(files);
      addLog('ISO Blueprint successfully synthesized!', 'success');
      setActiveStep(2);
    } catch (error) {
      addLog('Architectural failure: ' + (error as Error).message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAll = () => {
    const blob = new Blob([JSON.stringify(generatedFiles, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `isoforge-${config.os.toLowerCase()}-config.json`;
    a.click();
    addLog('Blueprint bundle downloaded successfully.', 'success');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800 pb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3 text-white">
            <span className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
              <Layers className="w-6 h-6" />
            </span>
            ISOForge <span className="text-zinc-500 font-normal">v1.1</span>
          </h1>
          <p className="text-zinc-400 mt-2">AI-Powered Custom Bootable Image Architect</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 border ${
            activeStep === 1 ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-zinc-800 border-zinc-700 text-zinc-500'
          }`}>
            <span className="w-5 h-5 rounded-full bg-zinc-900 border border-current flex items-center justify-center">1</span>
            Configure
          </div>
          <div className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 border ${
            activeStep === 2 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-zinc-800 border-zinc-700 text-zinc-500'
          }`}>
            <span className="w-5 h-5 rounded-full bg-zinc-900 border border-current flex items-center justify-center">2</span>
            Blueprint
          </div>
        </div>
      </header>

      {/* Quick Start Templates */}
      <section className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Quick Start Templates</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TEMPLATES.map(template => (
            <button
              key={template.id}
              onClick={() => loadTemplate(template.config)}
              className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.02] group ${template.color}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-zinc-950/50 rounded-lg border border-white/5">
                  {template.icon}
                </div>
                <div>
                  <h4 className="font-bold text-white group-hover:text-white">{template.name}</h4>
                  <p className="text-xs text-zinc-500 line-clamp-1">{template.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-md">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Monitor className="w-5 h-5 text-indigo-400" />
              Base System Selection
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Operating System</label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.values(OS).map(os => (
                    <button
                      key={os}
                      onClick={() => setConfig({ ...config, os })}
                      className={`px-4 py-3 rounded-xl border text-left transition-all ${
                        config.os === os 
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-100 ring-2 ring-indigo-500/20' 
                        : 'border-zinc-800 bg-zinc-950/50 hover:border-zinc-700 text-zinc-400'
                      }`}
                    >
                      {os}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Architecture</label>
                  <select 
                    value={config.architecture}
                    onChange={(e) => setConfig({...config, architecture: e.target.value as Arch})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  >
                    <option value={Arch.X86_64}>x86_64</option>
                    <option value={Arch.ARM64}>ARM64</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">OS Version</label>
                  <input 
                    type="text"
                    value={config.version}
                    onChange={(e) => setConfig({...config, version: e.target.value})}
                    placeholder="e.g. 24.04 LTS"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-md">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-400" />
              Automated Identity
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Hostname</label>
                <input 
                  type="text"
                  value={config.hostname}
                  onChange={(e) => setConfig({...config, hostname: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-300 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Default User</label>
                <input 
                  type="text"
                  value={config.username}
                  onChange={(e) => setConfig({...config, username: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-300 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
              <div className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={config.isCloudInitEnabled}
                  onChange={(e) => setConfig({...config, isCloudInitEnabled: e.target.checked})}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </div>
              <span className="text-sm font-medium text-zinc-300">Enable Cloud-Init Integration</span>
            </div>
          </section>

          <section className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-md">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <FileCode className="w-5 h-5 text-indigo-400" />
              Software & Scripts
            </h2>
            <div className="mb-6">
              <label className="block text-sm text-zinc-400 mb-2">Package Manifest</label>
              <div className="flex gap-2 mb-3">
                <input 
                  type="text"
                  value={newPackage}
                  onChange={(e) => setNewPackage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addPackage()}
                  placeholder="e.g. nginx"
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-300 focus:outline-none"
                />
                <button 
                  onClick={addPackage}
                  className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {config.packages.map(pkg => (
                  <span key={pkg} className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-lg text-xs flex items-center gap-2 group">
                    {pkg}
                    <button 
                      onClick={() => removePackage(pkg)}
                      className="text-zinc-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">AI Guidance / Extra Scripting</label>
              <textarea 
                value={config.customScripts}
                onChange={(e) => setConfig({...config, customScripts: e.target.value})}
                placeholder="Describe custom logic, e.g., 'Configure a static IP for eth0'..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none min-h-[100px] resize-none"
              />
            </div>
          </section>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg transition-all shadow-xl ${
              isGenerating 
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
                Synthesizing Image...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                Forge ISO Blueprint
              </>
            )}
          </button>
        </div>

        {/* Right Column: Output */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                <TerminalIcon className="w-4 h-4" />
                Live Build Logs
              </h3>
              {logs.length > 0 && (
                <span className="text-xs text-zinc-600">{logs.length} entries recorded</span>
              )}
            </div>
            <Terminal logs={logs} />
          </div>

          <div className="flex-1 flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between mb-2 px-2">
              <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                <FileCode className="w-4 h-4" />
                Generated Configuration Files
              </h3>
              {generatedFiles.length > 0 && (
                <button 
                  onClick={downloadAll}
                  className="text-xs flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Bundle
                </button>
              )}
            </div>
            
            <div className="flex-1 bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm">
              {generatedFiles.length > 0 ? (
                <FileTabs files={generatedFiles} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 text-zinc-500 space-y-4">
                  <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center">
                    <Layers className="w-8 h-8 opacity-20" />
                  </div>
                  <div className="max-w-xs">
                    <p className="font-semibold text-zinc-400 mb-1">Waiting for Forge Signal</p>
                    <p className="text-sm">Configure your system on the left and click 'Forge ISO' to generate optimized configuration blueprints.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl flex gap-3">
              <Info className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold mb-1">Note on Output</h4>
                <p className="text-xs text-zinc-400">ISOForge generates orchestration scripts. Use them with local tools like xorriso for the final .iso.</p>
              </div>
            </div>
            <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold mb-1">AI Optimized</h4>
                <p className="text-xs text-zinc-400">Gemini analyzes your package list to ensure kernel compatibility for the target architecture.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-20 pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-500 text-sm pb-12">
        <p>&copy; 2024 ISOForge AI Lab. Best practices for automated Linux deployments.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-zinc-300 transition-colors">Documentation</a>
          <a href="#" className="hover:text-zinc-300 transition-colors">OS Database</a>
          <a href="#" className="hover:text-zinc-300 transition-colors">Cloud-Init Help</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
