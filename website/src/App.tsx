import React, { useRef, useEffect, useState } from 'react';
import { HomeView, SettingsView, ExamplesView, AboutView } from './components/MockupViews';
import {
  BookOpen,
  ArrowRight,
  FolderOpen,
  Database,
  Rocket,
  Lock,
  RefreshCw,
  FileText,
  BarChart2,
  HardDrive,
  FolderTree,
  Eye,
  Sigma,
  Code,
  Download,
  Github,
  FileEdit,
  Terminal,
  Settings
} from 'lucide-react';

const ScaleWrapper = ({ children, width, height }: { children: React.ReactNode, width: number, height: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        setScale(containerWidth / width);
      }
    };

    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) observer.observe(containerRef.current);
    updateScale();

    return () => observer.disconnect();
  }, [width]);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden rounded-xl bg-[#0e0e0e]">
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `scale(${scale})`
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className="bg-background text-on-background font-body-preview min-h-screen flex flex-col antialiased overflow-x-hidden">
      {/* Top Navigation */}
      <nav className="flex justify-between items-center px-4 md:px-6 lg:px-xl h-16 w-full border-b border-outline-variant bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 md:gap-md">
          <span className="font-h1 text-lg sm:text-h1 font-black text-on-background">MinD.md</span>
        </div>
        <div className="flex items-center gap-4 md:gap-8 font-mono-ui text-[12px] sm:text-sm md:text-base text-on-surface-variant">
          <a className="hover:text-on-surface transition-colors font-semibold" href="#features">Features</a>
          <div className="relative flex flex-col items-center justify-center cursor-default font-semibold">
            <span className="line-through relative z-10">Pricing</span>
            <span className="absolute -bottom-6 md:-bottom-8 text-tertiary text-lg md:text-2xl font-bold" style={{ fontFamily: '"Caveat", cursive', transform: 'rotate(-8deg) translateZ(0)', backfaceVisibility: 'hidden', WebkitFontSmoothing: 'antialiased' }}>FREE!</span>
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-8">
          <a className="font-mono-ui text-base font-semibold text-on-surface-variant hover:text-on-surface hidden md:block" href="https://github.com/bhagesh-h/MinD.md/releases/tag/0.0.1">GitHub</a>
          <button className="bg-primary text-background font-mono-ui font-bold text-sm md:text-base px-3 md:px-6 py-2 md:py-2.5 rounded hover:brightness-110 transition-all flex items-center gap-1 md:gap-2">
            <Download className="w-4 h-4 md:w-5 md:h-5" /> <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="px-6 lg:px-xl py-24 md:py-32 flex flex-col items-center text-center max-w-5xl mx-auto relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-surface-container-high rounded-full blur-[100px] opacity-20 -z-10"></div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container border border-outline-variant text-primary mb-8 font-mono-ui text-xs">
            <span className="w-2 h-2 rounded-full bg-tertiary-fixed"></span>
            Build: 0.0.1-preview
          </div>

          <h1 className="font-h1 text-4xl md:text-6xl lg:text-7xl font-black text-on-background tracking-tight mb-md leading-tight">
            Your second brain,<br />in <span className="text-primary">Markdown</span>.
          </h1>
          <p className="font-body-preview text-on-surface-variant max-w-2xl text-lg md:text-xl mb-xl">
            MinD.md is a local-first markdown power tool, equipped with an extensive feature set designed to provide writing flow with zero distractions. Built for performance and privacy.
          </p>
          <div className="flex flex-col sm:flex-row gap-md w-full justify-center">
            <button className="bg-primary text-background font-h2 font-semibold text-h2 px-lg py-sm rounded-DEFAULT hover:brightness-110 transition-all flex items-center justify-center gap-sm" onclick="window.location.href='https://github.com/bhagesh-h/MinD.md/releases/download/0.0.1/MinD.md_win64_0.0.1.exe'">
              Get 🧠.md for Windows
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="bg-transparent border border-outline-variant text-on-background font-h2 text-h2 px-lg py-sm rounded-DEFAULT hover:bg-surface-container-low transition-all" onclick="window.location.href='https://github.com/bhagesh-h/MinD.md/blob/main/README.md'">
              View Documentation
            </button>
          </div>

          {/* Overlapping Mockups */}
          <div className="mt-24 relative w-full max-w-5xl mx-auto drop-shadow-2xl aspect-[1.55]">

            {/* Settings */}
            <div className="absolute top-0 left-[50%] w-[90%] md:w-full aspect-[1.55] bg-background border border-outline-variant rounded-xl shadow-2xl overflow-hidden animate-deck-shuffle" style={{ animationDelay: '-4s' }}>
              <ScaleWrapper width={1240} height={800}><SettingsView /></ScaleWrapper>
            </div>

            {/* Examples */}
            <div className="absolute top-0 left-[50%] w-[90%] md:w-full aspect-[1.55] bg-background border border-outline-variant rounded-xl shadow-2xl overflow-hidden animate-deck-shuffle" style={{ animationDelay: '-8s' }}>
              <ScaleWrapper width={1240} height={800}><ExamplesView /></ScaleWrapper>
            </div>

            {/* About */}
            <div className="absolute top-0 left-[50%] w-[90%] md:w-full aspect-[1.55] bg-background border border-outline-variant rounded-xl shadow-2xl overflow-hidden animate-deck-shuffle" style={{ animationDelay: '-12s' }}>
              <ScaleWrapper width={1240} height={800}><AboutView /></ScaleWrapper>
            </div>

            {/* Home */}
            <div className="absolute top-0 left-[50%] w-[90%] md:w-full aspect-[1.55] bg-background border border-outline-variant rounded-xl shadow-2xl overflow-hidden animate-deck-shuffle" style={{ animationDelay: '0s' }}>
              <ScaleWrapper width={1240} height={800}><HomeView /></ScaleWrapper>
            </div>
          </div>
        </section>

        {/* Feature Grid Section */}
        <section id="features" className="px-6 lg:px-xl py-24 bg-surface-container-lowest border-y border-outline-variant">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16 text-center md:text-left">
              <h2 className="font-h1 text-3xl md:text-4xl font-black text-on-background mb-sm">Features</h2>
              <p className="font-body-preview text-on-surface-variant max-w-2xl text-lg">
                Everything you need for thoughtful writing, organized intuitively.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: "Local-First Data", icon: <HardDrive />, color: "#fecaca" },
                { name: "Note Organization", icon: <FolderTree />, color: "#fef08a" },
                { name: "Advanced Rendering", icon: <Eye />, color: "#bbf7d0" },
                { name: "Diagrams & Math", icon: <Sigma />, color: "#bae6fd" },
                { name: "Syntax Highlighting", icon: <Code />, color: "#e9d5ff" },
                { name: "Flexible Export", icon: <Download />, color: "#fbcfe8" },
                { name: "GitHub Sync", icon: <Github />, color: "#e2e8f0" },
                { name: "Versatile Editor", icon: <FileEdit />, color: "#ccfbf1" }
              ].map((feature, i) => (
                <div key={i} className="p-4 md:p-8 flex flex-col items-center justify-center group cursor-default text-center aspect-square gap-6">
                  <div className="relative">
                    <div className="relative z-10 w-24 h-16 rounded-md shadow-lg flex items-center justify-center transform group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-300 backdrop-blur-md border" style={{ backgroundColor: `${feature.color}20`, borderColor: `${feature.color}40` }}>
                      <div className="absolute -top-3 left-1 w-8 h-3.5 rounded-t-sm backdrop-blur-md border border-b-0" style={{ backgroundColor: `${feature.color}20`, borderColor: `${feature.color}40` }}></div>
                      {React.cloneElement(feature.icon, { className: 'w-7 h-7 relative z-10', style: { color: feature.color } })}
                    </div>
                  </div>
                  <h3 className="font-h2 text-sm md:text-base font-semibold text-on-background">{feature.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Deep Dive Features */}
        <section className="px-6 lg:px-xl py-24 bg-background">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div className="flex gap-6 items-start group">
                <div className="p-3 bg-surface-container rounded-lg border border-outline-variant group-hover:border-primary transition-colors">
                  <Terminal className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-h2 text-xl font-semibold text-on-background mb-2">Command Palette</h4>
                  <p className="font-body-preview text-on-surface-variant text-base">Press <kbd className="bg-surface-container-highest px-2 py-0.5 rounded text-xs mx-1 font-mono-ui border border-outline-variant">CTRL + K</kbd> anywhere to quickly find files, run commands, or switch themes without touching the mouse.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start group">
                <div className="p-3 bg-surface-container rounded-lg border border-outline-variant group-hover:border-primary transition-colors">
                  <RefreshCw className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-h2 text-xl font-semibold text-on-background mb-2">Sync Engine</h4>
                  <p className="font-body-preview text-on-surface-variant text-base">Configure your own remote repository for cloud-sync and version control. Auto-sync interval keeps your vault updated locally and remotely.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start group">
                <div className="p-3 bg-surface-container rounded-lg border border-outline-variant group-hover:border-primary transition-colors">
                  <BarChart2 className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-h2 text-xl font-semibold text-on-background mb-2">Custom Themes</h4>
                  <p className="font-body-preview text-on-surface-variant text-base">Override Mermaid & Plotly color schemas using standard JSON configuration, directly integrating your aesthetic into all diagrams.</p>
                </div>
              </div>
            </div>

            {/* Mockup Data Table */}
            <div className="bg-surface border border-outline-variant rounded-xl flex flex-col overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-outline-variant bg-surface-container flex items-center justify-between">
                <h4 className="font-h2 text-lg font-semibold">Recent Files</h4>
              </div>
              <div className="p-0 font-mono-ui text-sm">
                <div className="grid grid-cols-12 gap-4 p-3 border-b border-outline-variant text-on-surface-variant text-xs font-bold uppercase tracking-wider">
                  <div className="col-span-8">Name</div>
                  <div className="col-span-2 text-right">Size</div>
                  <div className="col-span-2 text-right">Modified</div>
                </div>
                {[
                  { name: "Welcome to MinD.md", tag: "#onboarding", size: "3.1 KB", date: "5/8/2026" },
                  { name: "Daily Journal - May", tag: "#journal", size: "12.4 KB", date: "5/7/2026" },
                  { name: "Project Architecture", tag: "#dev", size: "8.2 KB", date: "5/5/2026" },
                  { name: "Meeting Notes", size: "1.5 KB", date: "5/5/2026" },
                  { name: "Untitled", size: "0.0 KB", date: "5/1/2026" }
                ].map((file, i) => (
                  <div key={i} className="grid grid-cols-12 gap-4 p-3 border-b border-outline-variant hover:bg-surface-container-high transition-colors items-center cursor-pointer">
                    <div className="col-span-8 flex items-center gap-3">
                      <FileText className="w-4 h-4 text-on-surface-variant" />
                      <span className="truncate">{file.name}</span>
                      {file.tag && <span className="text-[10px] px-2 py-0.5 rounded-full border border-[#fde047]/30 text-[#fde047] bg-[#fde047]/10">{file.tag}</span>}
                    </div>
                    <div className="col-span-2 text-right text-on-surface-variant text-xs">{file.size}</div>
                    <div className="col-span-2 text-right text-on-surface-variant text-xs">{file.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-outline-variant bg-surface-container-lowest py-8 px-6 lg:px-xl mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-mono-ui text-mono-ui text-on-surface-variant">© 2026 Created By Bhagesh</span>
          </div>
          <div className="flex gap-6 font-label-sm text-sm text-on-surface-variant">
            <a className="hover:text-on-surface transition-colors" href="https://github.com/bhagesh-h" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a className="hover:text-on-surface transition-colors" href="https://www.linkedin.com/in/bhagesh-hunakunti/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
          <div className="flex gap-6 font-mono-ui text-sm text-on-surface-variant">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
              Stable Build
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
