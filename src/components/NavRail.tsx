import React from 'react';
import { Home, Database, RefreshCw, BarChart2, Settings, List, Palette, Info, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavRailProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const VaultFolderIcon = ({ active }: { active: boolean }) => (
  <div className={cn(
    "relative w-5 h-4 flex items-center justify-center transition-opacity",
    active ? "" : "opacity-50 group-hover:opacity-100"
  )}>
    <div className={cn(
      "absolute inset-x-0 top-0 bottom-0.5 bg-white/20 rounded-[2px] border border-white/10",
      active && "bg-white/40 border-white/40"
    )}>
      <div className="absolute -top-[1.5px] left-[1px] w-2.5 h-0.5 bg-white/20 rounded-t-[0.5px] border-t border-x border-white/10"></div>
    </div>
    <div className="w-3.5 h-2.5 bg-white rounded-[0.5px] border border-white/20 rotate-1 relative z-10 shadow-sm flex items-center justify-center scale-90">
      <span className="text-[5px] font-black scale-75 text-black">MD</span>
    </div>
    <div className={cn(
      "absolute inset-x-0 top-[5px] bottom-0.5 bg-white/20 border-t border-white/10 rounded-b-[2px] z-20 backdrop-blur-[1px]",
      active && "bg-white/40"
    )}></div>
  </div>
);

export const NavRail: React.FC<NavRailProps> = ({ activeTab, onTabChange }) => {
  const items = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'vault', icon: Database, label: 'Vault' },
    { id: 'appearance', icon: Palette, label: 'Appearance' },
  ];

  return (
    <nav className="w-[60px] h-full flex flex-col items-center py-4 border-r border-[#262626] bg-[#111111] z-10 shrink-0">
      <div className="flex flex-col gap-4 w-full px-2 mt-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full aspect-square rounded-xl flex items-center justify-center group relative transition-colors",
              activeTab === item.id 
                ? "bg-white/5 text-white border border-white/5" 
                : "text-white/50 hover:text-white hover:bg-white/5"
            )}
            title={item.label}
          >
            {activeTab === item.id && (
                <div className="absolute left-[-2px] w-1 h-5 bg-white rounded-full" />
            )}
            {item.id === 'vault' ? (
                <VaultFolderIcon active={activeTab === 'vault'} />
            ) : (
                <item.icon size={20} className={cn(
                    activeTab === item.id ? "text-white" : "text-white/50 group-hover:text-white transition-colors"
                )} />
            )}
          </button>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-4 w-full px-2">
         <button 
           onClick={() => onTabChange('help')}
           className={cn(
             "w-full aspect-square rounded-xl flex items-center justify-center group relative transition-colors",
             activeTab === 'help' 
               ? "bg-white/5 text-white border border-white/5" 
               : "text-white/50 hover:text-white hover:bg-white/5"
           )}
           title="Help"
         >
           {activeTab === 'help' && (
               <div className="absolute left-[-2px] w-1 h-5 bg-white rounded-full" />
           )}
           <HelpCircle size={20} className={cn(
             activeTab === 'help' ? "text-white" : "text-white/50 group-hover:text-white transition-colors"
           )} />
         </button>
         <button 
           onClick={() => onTabChange('about')}
           className={cn(
             "w-full aspect-square rounded-xl flex items-center justify-center group relative transition-colors",
             activeTab === 'about' 
               ? "bg-white/5 text-white border border-white/5" 
               : "text-white/50 hover:text-white hover:bg-white/5"
           )}
           title="About"
         >
           {activeTab === 'about' && (
               <div className="absolute left-[-2px] w-1 h-5 bg-white rounded-full" />
           )}
           <Info size={20} className={cn(
             activeTab === 'about' ? "text-white" : "text-white/50 group-hover:text-white transition-colors"
           )} />
         </button>
         <button 
           onClick={() => onTabChange('settings')}
           className={cn(
             "w-full aspect-square rounded-xl flex items-center justify-center group relative transition-colors",
             activeTab === 'settings' 
               ? "bg-white/5 text-white border border-white/5" 
               : "text-white/50 hover:text-white hover:bg-white/5"
           )}
           title="Settings"
         >
           {activeTab === 'settings' && (
               <div className="absolute left-[-2px] w-1 h-5 bg-white rounded-full" />
           )}
           <Settings size={20} className={cn(
             activeTab === 'settings' ? "text-white" : "text-white/50 group-hover:text-white transition-colors"
           )} />
         </button>
      </div>
    </nav>
  );
};
