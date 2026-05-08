import React, { useState } from 'react';

const FeatureGraphic = ({ color = '#ffffff' }: { color?: string }) => (
  <div className="w-16 h-12 relative flex items-center justify-center">
    {/* Back flap */}
    <div className="absolute inset-x-2 top-0 bottom-2 bg-white/[0.08] rounded-lg border border-white/10 shadow-lg group-hover:bg-white/10">
      <div className="absolute -top-1 left-1 w-8 h-2 bg-white/[0.08] rounded-t-sm border-t border-x border-white/10"></div>
    </div>
    
    <div className="relative z-10 w-11 h-8 rounded-[1px] shadow-xl border border-black/5 flex flex-col p-1.5 gap-1 rotate-2 translate-y-[-2px]" style={{ backgroundColor: color }}>
      <div className="absolute top-1 right-1 flex items-center justify-center scale-[0.6]">
         <span className="text-[10px] font-black italic text-black px-0.5 rounded-sm border border-black/10" style={{ backgroundColor: color }}>★</span>
      </div>
      <div className="w-[60%] h-[1px] bg-black/10" />
      <div className="w-[40%] h-[1px] bg-black/10" />
      <div className="w-[80%] h-[1px] bg-black/10" />
      <div className="w-[70%] h-[1px] bg-black/10" />
    </div>

    {/* Front flap */}
    <div className="absolute inset-x-2 top-4 bottom-2 bg-white/5 rounded-lg border-t border-white/10 backdrop-blur-[6px] z-20 transition-all duration-300 group-hover:translate-y-1 group-hover:rotate-[-2deg] origin-bottom"></div>
  </div>
);

export const About: React.FC = () => {
    const [activeFeature, setActiveFeature] = useState<number | null>(null);

    const pastelColors = [
        '#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff', '#e8baff',
        '#ffb3e6', '#c4faf8', '#f0e6ef', '#f5d0ba', '#e7f0c3', '#a7c4e5'
    ];

    const features = [
        { title: "Local-First Data", desc: "All your data stays privately and securely on your device." },
        { title: "Note Organization", desc: "Manage notes via nested folders, tags, and fast fuzzy search." },
        { title: "Advanced Rendering", desc: "Support for GFM, tables, tasks, callouts, and clean HTML." },
        { title: "Diagrams & Math", desc: "Render Mermaid diagrams and LaTeX equations natively." },
        { title: "Syntax Highlighting", desc: "Beautiful real-time code highlighting via PrismJS." },
        { title: "Flexible Export", desc: "Export to MD, TXT, HTML, PDF, and DOC formats." },
        { title: "GitHub Sync", desc: "Backup notes automatically with private remote repositories." },
        { title: "Versatile Editor", desc: "Seamlessly switch between split, edit, and preview modes." }
    ];

    return (
        <div className="flex-1 overflow-y-auto p-8 bg-[#0a0a0a] scrollbar-thin pb-24" onClick={() => setActiveFeature(null)}>
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold mb-4 text-white tracking-tight">MinD.md</h2>
                <p className="text-gray-300 mb-12 max-w-3xl text-lg leading-relaxed">
                    MinD.md is a local-first markdown power tool, equipped with an extensive feature set designed to provide writing flow with zero distractions. Built for performance and privacy.
                </p>

                <h3 className="text-xl font-semibold mb-8 text-white tracking-tight">Features</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
                    {features.map((feature, i) => {
                        const noteColor = pastelColors[i % pastelColors.length];
                        return (
                        <div 
                            key={i} 
                            className="flex flex-col items-center group relative cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveFeature(activeFeature === i ? null : i);
                            }}
                        >
                            <div className="w-full aspect-[4/3] rounded-2xl flex items-center justify-center hover:bg-white/[0.03] border border-transparent hover:border-white/5 bg-[#111]/50 mb-3 relative">
                                <div className="group-hover:scale-110 transition-transform duration-300">
                                    <FeatureGraphic color={noteColor} />
                                </div>
                                {activeFeature === i && (
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] p-4 shadow-2xl rounded-md z-30 transform-gpu transition-all duration-200 border border-black/10" style={{ backgroundColor: noteColor }}>
                                        <div className="w-full h-3 bg-black/5 absolute top-0 left-0 rounded-t-md"></div>
                                        <p className="text-sm text-slate-900 font-bold leading-snug mt-1 relative z-10 text-center font-mono tracking-normal antialiased">
                                            {feature.desc}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="text-center w-full">
                                <h4 className="text-base font-bold text-white px-2 mb-1 leading-snug">
                                    {feature.title}
                                </h4>
                            </div>
                        </div>
                    )})}
                </div>
            </div>
        </div>
    );
};
