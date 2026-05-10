import React from 'react';
import {
  FolderOpen,
  FileText,
  Search,
  Plus,
  FolderPlus,
  Home,
  Palette,
  HelpCircle,
  Info,
  Settings,
  EditIcon,
  Columns,
  Eye,
  RefreshCw,
  ChevronDown,
  Download,
  RotateCcw,
  Save,
  FileJson
} from 'lucide-react';

export const HomeView = () => {
  return (
    <div className="w-[1240px] h-[800px] flex flex-col bg-[#0e0e0e] text-on-surface font-sans text-sm overflow-hidden text-left shadow-2xl rounded-xl border border-[#202020]">
      <div className="flex flex-1 overflow-hidden">
        {/* Activity Bar */}
        <div className="w-12 border-r border-[#202020] flex flex-col items-center py-4 gap-4 bg-[#0e0e0e]">
          <div className="w-8 h-8 rounded flex items-center justify-center bg-surface-variant cursor-pointer text-on-surface relative">
            <div className="absolute left-[-8px] w-1 h-5 bg-on-surface rounded-r"></div>
            <Home className="w-5 h-5" />
          </div>
          <div className="w-8 h-8 rounded flex items-center justify-center hover:bg-surface-variant cursor-pointer text-outline">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div className="w-8 h-8 rounded flex items-center justify-center hover:bg-surface-variant cursor-pointer text-outline">
            <Palette className="w-5 h-5" />
          </div>
          <div className="flex-1"></div>
          <div className="w-8 h-8 rounded flex items-center justify-center hover:bg-surface-variant cursor-pointer text-outline">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div className="w-8 h-8 rounded flex items-center justify-center hover:bg-surface-variant cursor-pointer text-outline">
            <Info className="w-5 h-5" />
          </div>
          <div className="w-8 h-8 rounded flex items-center justify-center hover:bg-surface-variant cursor-pointer text-outline">
            <Settings className="w-5 h-5" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-64 border-r border-[#202020] flex flex-col bg-[#0e0e0e]">
          <div className="p-4 flex flex-col gap-4 border-b border-[#202020]">
            <div className="flex items-center gap-2 bg-[#131313] border border-[#353535] rounded px-3 py-1.5 focus-within:border-primary transition-colors">
              <Search className="w-4 h-4 text-outline" />
              <input type="text" placeholder="Search files..." className="bg-transparent border-none outline-none text-sm w-full text-on-surface" />
              <Plus className="w-4 h-4 text-outline hover:text-on-surface cursor-pointer" />
              <FolderPlus className="w-4 h-4 text-outline hover:text-on-surface cursor-pointer" />
            </div>
            <div className="flex">
              <div className="flex-1 text-center pb-2 border-b-2 border-white text-xs font-semibold text-on-surface">Folders</div>
              <div className="flex-1 text-center pb-2 border-b-2 border-transparent text-outline text-xs font-semibold cursor-pointer hover:text-on-surface">Tags</div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar p-2">
            <div className="flex items-center gap-2 text-on-surface mb-1 font-mono text-[13px] font-bold px-2 py-1 hover:bg-[#1a1c1c] rounded cursor-pointer">
              <ChevronDown className="w-4 h-4" /> <FolderOpen className="w-4 h-4" /> My Vault
            </div>
            <div className="pl-6 flex flex-col gap-0.5 font-mono text-[13px] text-outline">
              <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#1a1c1c] rounded cursor-pointer"><ChevronDown className="w-3 h-3 -rotate-90 opacity-50" /><FolderOpen className="w-3 h-3" /> New Folder</div>
              <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#1a1c1c] rounded cursor-pointer"><ChevronDown className="w-3 h-3 -rotate-90 opacity-50" /><FolderOpen className="w-3 h-3" /> New Folder</div>
              <div className="flex items-center gap-2 px-2 py-1.5 bg-[#202020] text-on-surface rounded cursor-pointer"><FileText className="w-3 h-3" /> Welcome to Markdown St...</div>
              <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#1a1c1c] rounded cursor-pointer"><FileText className="w-3 h-3" /> Untitled</div>
              <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#1a1c1c] rounded cursor-pointer"><FileText className="w-3 h-3" /> Untitled</div>
              <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#1a1c1c] rounded cursor-pointer"><FileText className="w-3 h-3" /> Untitled</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-[#131313]">
          {/* Header */}
          <div className="h-12 border-b border-[#202020] flex items-center justify-between px-4 bg-[#0e0e0e]">
            <div className="flex items-center gap-2 font-mono text-xs text-outline tracking-wider">
              <span className="text-primary opacity-50">#</span> /WELCOME-TO-MinD-md.MD
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#353535] rounded bg-[#131313] p-0.5">
                <div className="p-1 hover:bg-[#202020] rounded cursor-pointer"><EditIcon className="w-3.5 h-3.5 text-outline" /></div>
                <div className="p-1 bg-[#202020] rounded cursor-pointer"><Columns className="w-3.5 h-3.5 text-on-surface" /></div>
                <div className="p-1 hover:bg-[#202020] rounded cursor-pointer"><Eye className="w-3.5 h-3.5 text-outline" /></div>
              </div>
              <div className="flex items-center gap-1 border border-[#353535] rounded bg-[#131313] px-2 py-1 cursor-pointer hover:bg-[#202020]">
                <RefreshCw className="w-3.5 h-3.5 text-outline" />
                <span className="text-xs font-mono text-outline">COMMIT & SYNC</span>
              </div>
              <div className="flex items-center gap-1 border border-[#353535] rounded bg-[#131313] px-2 py-1 cursor-pointer hover:bg-[#202020]">
                <span className="text-xs font-mono text-outline">.MARKDOWN</span>
                <ChevronDown className="w-3.5 h-3.5 text-outline" />
              </div>
              <div className="p-1 border border-[#353535] rounded bg-[#131313] cursor-pointer hover:bg-[#202020]">
                <Download className="w-3.5 h-3.5 text-outline" />
              </div>
            </div>
          </div>

          {/* Editor & Preview */}
          <div className="flex-1 flex overflow-hidden">
            {/* Editor Pane */}
            <div className="flex-1 p-8 font-mono text-[15px] leading-relaxed text-[#e5e2e1] overflow-y-auto no-scrollbar border-r border-[#202020]">
              <div className="text-4xl font-sans font-bold mb-6 tracking-tight text-white">Welcome to MinD.md</div>
              <div className="flex items-center gap-4 text-xs font-sans opacity-50 tracking-wide mb-8 uppercase font-bold">
                <span>Created: <span className="text-primary font-mono ml-1">5/8/2026</span></span>
                <span>|</span>
                <span className="flex items-center gap-2">Tags: <span className="text-[#fde047] border border-[#fde047]/30 bg-[#fde047]/10 px-2 py-0.5 rounded-full normal-case font-mono">#onboarding</span> <span className="opacity-50">Add tag...</span></span>
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-[#a5d6ff] font-bold">#</span> Markdown Elements Guide<br /><br />
                  This guide shows all possible markdown elements that<br />
                  can be used and rendered in MinD.md.
                </div>
                <div>
                  <span className="text-[#a5d6ff] font-bold">##</span> Typography<br /><br />
                  <span className="text-[#a5d6ff] font-bold">###</span> Headers<br /><br />
                  <span className="text-[#a5d6ff] font-bold">#</span> Header 1<br />
                  <span className="text-[#a5d6ff] font-bold">##</span> Header 2<br />
                  <span className="text-[#a5d6ff] font-bold">###</span> Header 3<br />
                  <span className="text-[#a5d6ff] font-bold">####</span> Header 4<br />
                  <span className="text-[#a5d6ff] font-bold">#####</span> Header 5<br />
                  <span className="text-[#a5d6ff] font-bold">######</span> Header 6
                </div>
                <div>
                  <span className="text-[#a5d6ff] font-bold">###</span> Emphasis<br /><br />
                  *Italic text* or _Italic text_<br />
                  **Bold text** or __Bold text__<br />
                  ***Bold and Italic***<br />
                  ~~Strikethrough text~~<br />
                  ==Highlighted text==
                </div>
              </div>
            </div>

            {/* Preview Pane */}
            <div className="flex-1 p-8 bg-[#0e0e0e] overflow-y-auto no-scrollbar">
              <div className="max-w-2xl font-sans text-white">
                <h1 className="text-3xl font-bold mb-6 pb-2 border-b border-[#202020]">Markdown Elements Guide</h1>
                <p className="mb-6 leading-relaxed text-base">This guide shows all possible markdown elements that can be used and rendered in MinD.md.</p>

                <h2 className="text-2xl font-bold mb-4 mt-8 pb-2 border-b border-[#202020]">Typography</h2>
                <h3 className="text-xl font-bold mb-4 mt-6">Headers</h3>

                <h1 className="text-3xl font-bold mb-4 mt-6">Header 1</h1>
                <hr className="border-[#202020] mb-4" />
                <h2 className="text-2xl font-bold mb-4 mt-6">Header 2</h2>
                <hr className="border-[#202020] mb-4" />
                <h3 className="text-xl font-bold mb-4 mt-6">Header 3</h3>
                <h4 className="text-lg font-bold mb-4 mt-6">Header 4</h4>
                <h5 className="text-base font-bold mb-4 mt-6">Header 5</h5>
                <h6 className="text-sm font-bold mb-4 mt-6">Header 6</h6>

                <h3 className="text-xl font-bold mb-4 mt-8">Emphasis</h3>
                <p className="mb-2 italic">Italic text <span className="opacity-60 not-italic">or</span> Italic text</p>
                <p className="mb-2 font-bold">Bold text <span className="opacity-60 font-normal">or</span> Bold text</p>
                <p className="mb-2 font-bold italic text-[#fde047]">Bold and Italic</p>
                <p className="mb-2 line-through">Strikethrough text</p>
                <p className="mb-2"><span className="bg-[#d9971c]/20 text-[#d9971c] px-1 rounded">Highlighted text</span></p>

                <h2 className="text-2xl font-bold mb-4 mt-8 pb-2 border-b border-[#202020]">Lists</h2>
                <h3 className="text-xl font-bold mb-4 mt-6">Unordered List</h3>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>Item 1</li>
                  <li>Item 2</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="h-8 border-t border-[#202020] flex items-center justify-between px-4 bg-[#0e0e0e] text-[10px] uppercase font-bold tracking-widest text-[#666]">
            <div className="flex gap-4 font-mono">
              <span>Words: 496</span>
              <span>Chars: 3210</span>
              <span>Ln 1, Col 1</span>
            </div>
            <div className="font-mono">Last Saved: 04:59 PM</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SettingsView = () => {
  return (
    <div className="w-[1240px] h-[800px] flex flex-col bg-[#0e0e0e] text-on-surface font-sans text-sm overflow-hidden text-left shadow-2xl rounded-xl border border-[#202020]">
      <div className="flex flex-1 overflow-hidden">
        {/* Activity Bar */}
        <div className="w-12 border-r border-[#202020] flex flex-col items-center py-4 gap-4 bg-[#0e0e0e] z-10">
          <div className="w-8 h-8 rounded flex items-center justify-center hover:bg-surface-variant cursor-pointer text-outline">
            <Home className="w-5 h-5" />
          </div>
          <div className="w-8 h-8 rounded flex items-center justify-center hover:bg-surface-variant cursor-pointer text-outline">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div className="w-8 h-8 rounded flex items-center justify-center hover:bg-surface-variant cursor-pointer text-outline">
            <Palette className="w-5 h-5" />
          </div>
          <div className="flex-1"></div>
          <div className="w-8 h-8 rounded flex items-center justify-center hover:bg-surface-variant cursor-pointer text-outline">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div className="w-8 h-8 rounded flex items-center justify-center hover:bg-surface-variant cursor-pointer text-outline">
            <Info className="w-5 h-5" />
          </div>
          <div className="w-8 h-8 rounded flex items-center justify-center bg-surface-variant cursor-pointer text-on-surface relative">
            <div className="absolute left-[-8px] w-1 h-5 bg-on-surface rounded-r"></div>
            <Settings className="w-5 h-5" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-[#0e0e0e] relative">
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-6 bg-[#0e0e0e]">
            <div className="flex items-center gap-3">
              <FileJson className="w-5 h-5 text-outline" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-widest text-[#666] uppercase">Appearance Config</span>
                <span className="font-mono text-base font-bold text-white tracking-wider">~/config/plots.json</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 text-outline bg-transparent hover:bg-[#202020] px-4 py-2 rounded text-xs font-bold uppercase transition-colors tracking-widest border border-transparent">
                <RotateCcw className="w-4 h-4" /> Reset Defaults
              </button>
              <button className="flex items-center gap-2 bg-on-surface text-background px-4 py-2 rounded text-xs font-bold uppercase hover:bg-on-surface/90 transition-colors tracking-widest">
                <Save className="w-4 h-4" /> Save Config
              </button>
            </div>
          </div>

          {/* JSON Editor Pane */}
          <div className="flex-1 p-8 font-mono text-[15px] leading-8 text-[#e5e2e1] overflow-y-auto no-scrollbar pb-24">
            <div>{"{"}</div>
            <div className="pl-6"><span className="text-[#a5d6ff]">"theme"</span>: <span className="text-[#fde047]">"dark"</span>,</div>
            <div className="pl-6"><span className="text-[#a5d6ff]">"colors"</span>: {"{"}</div>
            <div className="pl-12 flex items-center gap-2"><span className="text-[#a5d6ff]">"primary"</span>: <div className="w-3 h-3 rounded-full bg-[#7dd3fc]"></div> <span className="text-[#fde047]">"#7dd3fc"</span>,</div>
            <div className="pl-12 flex items-center gap-2"><span className="text-[#a5d6ff]">"secondary"</span>: <div className="w-3 h-3 rounded-full bg-[#fde047]"></div> <span className="text-[#fde047]">"#fde047"</span>,</div>
            <div className="pl-12 flex items-center gap-2"><span className="text-[#a5d6ff]">"tertiary"</span>: <div className="w-3 h-3 rounded-full bg-[#86efac]"></div> <span className="text-[#fde047]">"#86efac"</span>,</div>
            <div className="pl-12 flex items-center gap-2"><span className="text-[#a5d6ff]">"background"</span>: <div className="w-3 h-3 rounded-full border border-outline bg-transparent"></div> <span className="text-[#fde047]">"transparent"</span>,</div>
            <div className="pl-12 flex items-center gap-2"><span className="text-[#a5d6ff]">"text"</span>: <div className="w-3 h-3 rounded-full border border-outline bg-[#0f172a]"></div> <span className="text-[#fde047]">"#0f172a"</span>,</div>
            <div className="pl-12 flex items-center gap-2"><span className="text-[#a5d6ff]">"border"</span>: <div className="w-3 h-3 rounded-full bg-[#0ea5e9]"></div> <span className="text-[#fde047]">"#0ea5e9"</span></div>
            <div className="pl-6">{"},"}</div>

            <div className="pl-6"><span className="text-[#a5d6ff]">"mermaid"</span>: {"{"}</div>
            <div className="pl-12 flex items-center gap-2"><span className="text-[#a5d6ff]">"primaryColor"</span>: <div className="w-3 h-3 rounded-full bg-[#7dd3fc]"></div> <span className="text-[#fde047]">"#7dd3fc"</span>,</div>
            <div className="pl-12 flex items-center gap-2"><span className="text-[#a5d6ff]">"primaryTextColor"</span>: <div className="w-3 h-3 rounded-full border border-outline bg-[#0f172a]"></div> <span className="text-[#fde047]">"#0f172a"</span>,</div>
            <div className="pl-12 flex items-center gap-2"><span className="text-[#a5d6ff]">"primaryBorderColor"</span>: <div className="w-3 h-3 rounded-full bg-[#38bdf8]"></div> <span className="text-[#fde047]">"#38bdf8"</span>,</div>
            <div className="pl-12 flex items-center gap-2"><span className="text-[#a5d6ff]">"lineColor"</span>: <div className="w-3 h-3 rounded-full bg-[#94a3b8]"></div> <span className="text-[#fde047]">"#94a3b8"</span>,</div>
            <div className="pl-12 flex items-center gap-2"><span className="text-[#a5d6ff]">"secondaryColor"</span>: <div className="w-3 h-3 rounded-full bg-[#fde047]"></div> <span className="text-[#fde047]">"#fde047"</span>,</div>
            <div className="pl-12 flex items-center gap-2"><span className="text-[#a5d6ff]">"tertiaryColor"</span>: <div className="w-3 h-3 rounded-full bg-[#86efac]"></div> <span className="text-[#fde047]">"#86efac"</span>,</div>
            <div className="pl-12 flex items-center gap-2"><span className="text-[#a5d6ff]">"mainBkg"</span>: <div className="w-3 h-3 rounded-full border border-outline bg-transparent"></div> <span className="text-[#fde047]">"transparent"</span>,</div>
            <div className="pl-12 flex items-center gap-2"><span className="text-[#a5d6ff]">"nodeBorder"</span>: <div className="w-3 h-3 rounded-full bg-[#0ea5e9]"></div> <span className="text-[#fde047]">"#0ea5e9"</span>,</div>
            <div className="pl-6">{"},"}</div>
            <div className="pl-6"><span className="text-[#a5d6ff]">"charts"</span>: {"{"}</div>
            <div className="pl-12 flex flex-col">
              <span><span className="text-[#a5d6ff]">"pie"</span>: [</span>
              <div className="pl-6 flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#7dd3fc]"></div><span className="text-[#fde047]">"#7dd3fc"</span>,</div>
              <div className="pl-6 flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#fde047]"></div><span className="text-[#fde047]">"#fde047"</span>,</div>
              <div className="pl-6 flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#86efac]"></div><span className="text-[#fde047]">"#86efac"</span>,</div>
              <div className="pl-6 flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#fda4af]"></div><span className="text-[#fde047]">"#fda4af"</span>,</div>
              <div className="pl-6 flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#d8b4fe]"></div><span className="text-[#fde047]">"#d8b4fe"</span></div>
              <span>],</span>
            </div>
            <div className="pl-12"><span className="text-[#a5d6ff]">"font"</span>: <span className="text-[#fde047]">"\"Inter\", sans-serif"</span></div>
            <div className="pl-6">{"},"}</div>
            <div className="pl-6"><span className="text-[#a5d6ff]">"callouts"</span>: {"{"}</div>
            <div className="pl-12"><span className="text-[#a5d6ff]">"note"</span>: {"{"}</div>
            <div className="pl-16 flex items-center gap-2"><span className="text-[#a5d6ff]">"background"</span>: <div className="w-3 h-3 rounded-full bg-[#f0f7fb]"></div> <span className="text-[#fde047]">"#f0f7fb"</span>,</div>
            <div className="pl-16 flex items-center gap-2"><span className="text-[#a5d6ff]">"text"</span>: <div className="w-3 h-3 rounded-full border border-outline bg-[#000000]"></div> <span className="text-[#fde047]">"#000000"</span>,</div>
            <div className="pl-16 flex items-center gap-2"><span className="text-[#a5d6ff]">"border"</span>: <div className="w-3 h-3 rounded-full bg-[#447099]"></div> <span className="text-[#fde047]">"#447099"</span></div>
            <div className="pl-12">{"},"}</div>
            <div className="pl-12"><span className="text-[#a5d6ff]">"tip"</span>: {"{"}</div>
            <div className="pl-16 flex items-center gap-2"><span className="text-[#a5d6ff]">"background"</span>: <div className="w-3 h-3 rounded-full bg-[#eefaef]"></div> <span className="text-[#fde047]">"#eefaef"</span>,</div>
            <div className="pl-16 flex items-center gap-2"><span className="text-[#a5d6ff]">"text"</span>: <div className="w-3 h-3 rounded-full border border-outline bg-[#000000]"></div> <span className="text-[#fde047]">"#000000"</span>,</div>
            <div className="pl-16 flex items-center gap-2"><span className="text-[#a5d6ff]">"border"</span>: <div className="w-3 h-3 rounded-full bg-[#027a38]"></div> <span className="text-[#fde047]">"#027a38"</span></div>
            <div className="pl-12">{"}"}</div>
            <div className="pl-6">{"}"}</div>
            <div>{"}"}</div>
          </div>

          <div className="absolute bottom-6 right-6 font-mono text-[11px] font-bold tracking-[0.2em] bg-[#1a1c1c]/80 backdrop-blur-md text-white px-4 py-2 rounded-full border border-[#303030]">
            CNTRL + K <span className="opacity-50 mx-2 text-[#666]">|</span> FINDER
          </div>
        </div>
      </div>
    </div>
  );
};

export const ExamplesView = () => {
  return (
    <div className="w-[1240px] h-[800px] flex flex-col bg-[#0e0e0e] text-on-surface font-sans text-sm overflow-hidden text-left shadow-2xl rounded-xl border border-[#202020]">
      <div className="flex flex-1 overflow-hidden">
        {/* Activity Bar */}
        <div className="w-12 border-r border-[#202020] flex flex-col items-center py-4 gap-4 bg-[#0e0e0e] z-10">
          <div className="w-8 h-8 rounded flex items-center justify-center hover:bg-surface-variant cursor-pointer text-outline">
            <Home className="w-5 h-5" />
          </div>
          <div className="w-8 h-8 rounded flex items-center justify-center hover:bg-surface-variant cursor-pointer text-outline">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div className="w-8 h-8 rounded flex items-center justify-center hover:bg-surface-variant cursor-pointer text-outline">
            <Palette className="w-5 h-5" />
          </div>
          <div className="flex-1"></div>
          <div className="w-8 h-8 rounded flex items-center justify-center bg-surface-variant cursor-pointer text-on-surface relative">
            <div className="absolute left-[-8px] w-1 h-5 bg-on-surface rounded-r"></div>
            <HelpCircle className="w-5 h-5" />
          </div>
          <div className="w-8 h-8 rounded flex items-center justify-center hover:bg-surface-variant cursor-pointer text-outline">
            <Info className="w-5 h-5" />
          </div>
          <div className="w-8 h-8 rounded flex items-center justify-center hover:bg-surface-variant cursor-pointer text-outline">
            <Settings className="w-5 h-5" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-[#131313] relative">
          {/* Header */}
          <div className="h-12 border-b border-[#202020] flex items-center px-6 bg-[#0e0e0e]">
            <div className="flex items-center gap-2 font-sans font-bold text-sm text-white">
              <HelpCircle className="w-4 h-4 text-outline" /> Help Guide
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Left Pane: Code */}
            <div className="flex-1 p-8 font-mono text-[14px] leading-relaxed text-[#e5e2e1] overflow-y-auto no-scrollbar border-r border-[#202020] pb-24">
              <div className="opacity-50 mb-2">```mermaid</div>
              <div>graph LR</div>
              <div className="pl-4">A[Hard edge] --&gt;|Link text| B(Round edge)</div>
              <div className="pl-4">B --&gt; C{"{"}Decision{"}"}</div>
              <div className="pl-4">C --&gt;|One| D[Result one]</div>
              <div className="pl-4">C --&gt;|Two| E[Result two]</div>
              <div className="opacity-50 mt-2 mb-8">```</div>

              <div className="text-[#a5d6ff] font-bold opacity-80 mb-4">### State Diagrams (Mermaid)</div>
              <div className="opacity-50 mb-2">```mermaid</div>
              <div>stateDiagram-v2</div>
              <div className="pl-4">[*] --&gt; Still</div>
              <div className="pl-4">Still --&gt; [*]</div>
              <div className="pl-4">Still --&gt; Moving</div>
              <div className="pl-4">Moving --&gt; Still</div>
              <div className="pl-4">Moving --&gt; Crash</div>
              <div className="pl-4">Crash --&gt; [*]</div>
              <div className="opacity-50 mt-2 mb-8">```</div>

              <div className="text-[#a5d6ff] font-bold opacity-80 mb-4">### Class Diagrams (Mermaid)</div>
              <div className="opacity-50 mb-2">```mermaid</div>
              <div>classDiagram</div>
              <div className="pl-4">Animal &lt;|-- Duck</div>
              <div className="pl-4">Animal &lt;|-- Fish</div>
              <div className="pl-4">Animal &lt;|-- Zebra</div>
              <div className="pl-4">Animal : +int age</div>
              <div className="pl-4">Animal : +String gender</div>
              <div className="pl-4">Animal : +isMammal()</div>
              <div className="pl-4">Animal : +mate()</div>
              <div className="pl-4">class Duck{"{"}</div>
              <div className="pl-8">+String beakColor</div>
              <div className="pl-8">+swim()</div>
              <div className="pl-8">+quack()</div>
              <div className="pl-4">{"}"}</div>
              <div className="pl-4">class Fish{"{"}</div>
              <div className="pl-8">-int sizeInFeet</div>
              <div className="pl-8">-canEat()</div>
              <div className="pl-4">{"}"}</div>
              <div className="opacity-50 mt-2 mb-8">```</div>
            </div>

            {/* Right Pane: Renders */}
            <div className="flex-1 p-8 bg-[#0e0e0e] overflow-y-auto no-scrollbar space-y-12 pb-24">
              <div className="space-y-4">
                {/* Flowchart omitted from image, starts at State */}
                <div className="border border-[#202020] bg-[#131313] rounded-xl p-8 flex items-center justify-center min-h-[300px]">
                  <div className="flex flex-col items-center gap-6">
                    <div className="border border-outline-variant px-6 py-2 rounded-full text-sm font-sans bg-[#1c2e3a] text-[#7dd3fc]">Still</div>
                    <div className="h-8 w-px bg-outline-variant relative"><div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 border-r border-b border-outline-variant rotate-45"></div></div>
                    <div className="border border-outline-variant px-6 py-2 rounded-xl text-sm font-sans bg-[#1c2e3a] text-[#7dd3fc]">Moving</div>
                    <div className="h-8 w-px bg-outline-variant relative"><div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 border-r border-b border-outline-variant rotate-45"></div></div>
                    <div className="border border-outline-variant px-6 py-2 rounded-xl text-sm font-sans bg-[#1c2e3a] text-[#7dd3fc]">Crash</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Class Diagrams (Mermaid)</h3>
                <div className="border border-[#202020] bg-[#131313] rounded-xl p-8 flex items-center justify-center min-h-[300px] font-sans">
                  <div className="flex flex-col items-center">
                    <div className="border border-[#202020] bg-[#131313] rounded overflow-hidden shadow w-48 text-center text-[10px]">
                      <div className="bg-[#1c2e3a] py-1 border-b border-[#202020] font-bold text-white">Animal</div>
                      <div className="py-2 border-b border-[#202020] text-left px-2 leading-relaxed">
                        <div>+int age</div>
                        <div>+String gender</div>
                      </div>
                      <div className="py-2 text-left px-2 leading-relaxed">
                        <div>+isMammal()</div>
                        <div>+mate()</div>
                      </div>
                    </div>
                    {/* Lines and arrows would go here in a real SVG, mocking roughly */}
                    <div className="flex justify-between w-96 mt-12 gap-4">
                      <div className="border border-[#202020] bg-[#131313] rounded overflow-hidden shadow w-full text-center text-[10px] flex-1">
                        <div className="bg-[#1c2e3a] py-1 border-b border-[#202020] font-bold text-white">Duck</div>
                        <div className="py-2 border-b border-[#202020] text-left px-2 leading-relaxed">
                          <div>+String beakColor</div>
                        </div>
                        <div className="py-2 text-left px-2 leading-relaxed">
                          <div>+swim()</div>
                          <div>+quack()</div>
                        </div>
                      </div>
                      <div className="border border-[#202020] bg-[#131313] rounded overflow-hidden shadow w-full text-center text-[10px] flex-1">
                        <div className="bg-[#1c2e3a] py-1 border-b border-[#202020] font-bold text-white">Fish</div>
                        <div className="py-2 border-b border-[#202020] text-left px-2 leading-relaxed">
                          <div>-int sizeInFeet</div>
                        </div>
                        <div className="py-2 text-left px-2 leading-relaxed">
                          <div>-canEat()</div>
                        </div>
                      </div>
                      <div className="border border-[#202020] bg-[#131313] rounded overflow-hidden shadow w-full text-center text-[10px] flex-1">
                        <div className="bg-[#1c2e3a] py-1 border-b border-[#202020] font-bold text-white">Zebra</div>
                        <div className="py-2 border-b border-[#202020] text-left px-2 leading-relaxed">
                          <div>+bool is_wild</div>
                        </div>
                        <div className="py-2 text-left px-2 leading-relaxed">
                          <div>+run()</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Pie Charts (Mermaid)</h3>
                <div className="border border-[#202020] bg-[#131313] rounded-xl p-8 flex items-center justify-center min-h-[300px]">
                  <div className="flex flex-col items-center w-full">
                    <div className="font-bold mb-8 text-on-surface">Pets adopted by volunteers</div>
                    <div className="flex justify-center items-center gap-12 w-full pr-12">
                      <div className="relative w-48 h-48 rounded-full border border-[#202020] flex items-center justify-center overflow-hidden shadow-inner"
                        style={{ background: 'conic-gradient(#86efac 0% 4%, #131313 4% 4.5%, #fde047 4.5% 26%, #131313 26% 26.5%, #7dd3fc 26.5% 99.5%, #131313 99.5% 100%)' }}>
                        <div className="absolute text-[10px] text-black font-bold" style={{ top: '15%', left: '55%' }}>4%</div>
                        <div className="absolute text-[11px] text-black font-bold" style={{ top: '32%', left: '72%' }}>22%</div>
                        <div className="absolute text-sm text-black font-bold" style={{ top: '60%', left: '35%' }}>74%</div>
                      </div>
                      <div className="flex flex-col gap-3 font-sans font-bold">
                        <div className="flex items-center gap-3"><div className="w-3 h-3 bg-[#7dd3fc]"></div> Dogs</div>
                        <div className="flex items-center gap-3"><div className="w-3 h-3 bg-[#fde047]"></div> Cats</div>
                        <div className="flex items-center gap-3"><div className="w-3 h-3 bg-[#86efac]"></div> Rats</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-6 right-6 font-mono text-[11px] font-bold tracking-[0.2em] bg-[#1a1c1c]/80 backdrop-blur-md text-white px-4 py-2 rounded-full border border-[#303030]">
            CNTRL + K <span className="opacity-50 mx-2 text-[#666]">|</span> FINDER
          </div>
        </div>
      </div>
    </div>
  );
};

export const AboutView = () => {
  return (
    <div className="w-[1240px] h-[800px] flex flex-col bg-[#0b0c0c] text-on-surface font-sans text-sm overflow-hidden text-left shadow-2xl rounded-xl border border-[#202020]">
      <div className="flex flex-1 overflow-hidden">
        {/* Activity Bar */}
        <div className="w-12 border-r border-[#202020] flex flex-col items-center py-4 gap-4 bg-[#0b0c0c] z-10">
          <div className="w-8 h-8 rounded flex items-center justify-center hover:bg-surface-variant cursor-pointer text-outline">
            <Home className="w-5 h-5" />
          </div>
          <div className="w-8 h-8 rounded flex items-center justify-center hover:bg-surface-variant cursor-pointer text-outline">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div className="w-8 h-8 rounded flex items-center justify-center hover:bg-surface-variant cursor-pointer text-outline">
            <Palette className="w-5 h-5" />
          </div>
          <div className="flex-1"></div>
          <div className="w-8 h-8 rounded flex items-center justify-center hover:bg-surface-variant cursor-pointer text-outline">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div className="w-8 h-8 rounded flex items-center justify-center bg-surface-variant cursor-pointer text-on-surface relative">
            <div className="absolute left-[-8px] w-1 h-5 bg-on-surface rounded-r"></div>
            <Info className="w-5 h-5" />
          </div>
          <div className="w-8 h-8 rounded flex items-center justify-center hover:bg-surface-variant cursor-pointer text-outline">
            <Settings className="w-5 h-5" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col p-12 overflow-y-auto no-scrollbar relative bg-[#0b0c0c]">
          <div className="max-w-4xl mx-auto w-full pt-8">
            <h1 className="text-4xl font-bold mb-6 text-white tracking-tight">MinD.md</h1>
            <p className="text-xl text-[#a3a3a3] mb-12 max-w-3xl leading-relaxed">
              MinD.md is a local-first markdown power tool, equipped with an extensive feature set designed to provide writing flow with zero distractions. Built for performance and privacy.
            </p>

            <h2 className="text-2xl font-bold mb-8 text-white">Features</h2>

            <div className="grid grid-cols-4 gap-6">
              {/* Feature Card 1 */}
              <div className="aspect-square bg-[#131415] border border-[#202020] rounded-2xl flex flex-col items-center justify-center gap-8 hover:bg-[#1a1c1c] transition-colors cursor-default relative group pt-4">
                <div className="w-16 h-12 bg-gradient-to-b from-[#fda4af] to-[#e11d48] rounded border border-white/10 shadow-[0_4px_20px_rgba(225,29,72,0.3)] relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-white/30 rounded-b"></div>
                </div>
                <span className="font-bold text-sm text-white">Local-First Data</span>
              </div>

              {/* Feature Card 2 */}
              <div className="aspect-square bg-[#131415] border border-[#202020] rounded-2xl flex flex-col items-center justify-center gap-8 hover:bg-[#1a1c1c] transition-colors cursor-default relative group pt-4">
                <div className="w-16 h-12 bg-gradient-to-b from-[#fde047] to-[#ca8a04] rounded border border-white/10 shadow-[0_4px_20px_rgba(202,138,4,0.3)] relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-white/30 rounded-b"></div>
                </div>
                <span className="font-bold text-sm text-white">Note Organization</span>
              </div>

              {/* Feature Card 3 */}
              <div className="aspect-square bg-[#131415] border border-[#202020] rounded-2xl flex flex-col items-center justify-center gap-8 hover:bg-[#1a1c1c] transition-colors cursor-default relative group pt-4">
                <div className="w-16 h-12 bg-gradient-to-b from-[#fef08a] to-[#a16207] rounded border border-white/10 shadow-[0_4px_20px_rgba(161,98,7,0.3)] relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-white/30 rounded-b"></div>
                </div>
                <span className="font-bold text-sm text-white">Advanced Rendering</span>
              </div>

              {/* Feature Card 4 */}
              <div className="aspect-square bg-[#131415] border border-[#202020] rounded-2xl flex flex-col items-center justify-center gap-8 hover:bg-[#1a1c1c] transition-colors cursor-default relative group pt-4">
                <div className="w-16 h-12 bg-gradient-to-b from-[#86efac] to-[#16a34a] rounded border border-white/10 shadow-[0_4px_20px_rgba(22,163,74,0.3)] relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-white/30 rounded-b"></div>
                </div>
                <span className="font-bold text-sm text-white">Diagrams & Math</span>
              </div>

              {/* Feature Card 5 */}
              <div className="aspect-square bg-[#131415] border border-[#202020] rounded-2xl flex flex-col items-center justify-center gap-8 hover:bg-[#1a1c1c] transition-colors cursor-default relative group pt-4">
                <div className="w-16 h-12 bg-gradient-to-b from-[#7dd3fc] to-[#0284c7] rounded border border-white/10 shadow-[0_4px_20px_rgba(2,132,199,0.3)] relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-white/30 rounded-b"></div>
                </div>
                <span className="font-bold text-sm text-white">Syntax Highlighting</span>
              </div>

              {/* Feature Card 6 (Hovered with Tooltip) */}
              <div className="aspect-square bg-[#131415] border border-[#202020] rounded-2xl flex flex-col items-center justify-center gap-8 transition-colors cursor-default relative pt-4">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#e9d5ff] text-[#4c1d95] font-bold px-4 py-3 rounded w-[150%] text-center text-xs shadow-xl z-20 whitespace-nowrap">
                  Export to MD, TXT, HTML, and DOC formats.
                </div>
                <div className="w-16 h-12 bg-gradient-to-b from-[#d8b4fe] to-[#9333ea] rounded border border-white/10 shadow-[0_4px_20px_rgba(147,51,234,0.3)] opacity-40 relative mt-4">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-white/30 rounded-b"></div>
                </div>
                <span className="font-bold text-sm text-white opacity-40">Flexible Export</span>
              </div>

              {/* Feature Card 7 */}
              <div className="aspect-square bg-[#131415] border border-[#202020] rounded-2xl flex flex-col items-center justify-center gap-8 hover:bg-[#1a1c1c] transition-colors cursor-default relative group pt-4">
                <div className="w-16 h-12 bg-gradient-to-b from-[#f9a8d4] to-[#be185d] rounded border border-white/10 shadow-[0_4px_20px_rgba(190,24,93,0.3)] relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-white/30 rounded-b"></div>
                </div>
                <span className="font-bold text-sm text-white">GitHub Sync</span>
              </div>

              {/* Feature Card 8 */}
              <div className="aspect-square bg-[#131415] border border-[#202020] rounded-2xl flex flex-col items-center justify-center gap-8 hover:bg-[#1a1c1c] transition-colors cursor-default relative group pt-4">
                <div className="w-16 h-12 bg-gradient-to-b from-[#a7f3d0] to-[#059669] rounded border border-white/10 shadow-[0_4px_20px_rgba(5,150,105,0.3)] relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-white/30 rounded-b"></div>
                </div>
                <span className="font-bold text-sm text-white">Versatile Editor</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 right-6 font-mono text-[11px] font-bold tracking-[0.2em] bg-[#1a1c1c]/80 backdrop-blur-md text-white px-4 py-2 rounded-full border border-[#303030]">
            CNTRL + K <span className="opacity-50 mx-2 text-[#666]">|</span> FINDER
          </div>
        </div>
      </div>
    </div>
  );
};

import { useRef, useEffect, useState } from 'react';

const ScaleWrapper = ({ children, width, height }: { children: React.ReactNode, width: number, height: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    let rafId: number;
    const updateScale = () => {
      if (containerRef.current) setScale(containerRef.current.clientWidth / width);
    };
    const onResize = () => { cancelAnimationFrame(rafId); rafId = requestAnimationFrame(updateScale); };
    const observer = new ResizeObserver(onResize);
    if (containerRef.current) observer.observe(containerRef.current);
    updateScale();
    return () => { observer.disconnect(); cancelAnimationFrame(rafId); };
  }, [width]);
  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden rounded-xl bg-[#0e0e0e]">
      <div className="absolute top-0 left-0 origin-top-left" style={{ width: `${width}px`, height: `${height}px`, transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
};

export default function MockupCarousel() {
  return (
    <>
      <div className="absolute top-0 left-[50%] w-[90%] md:w-full aspect-[1.55] bg-background border border-outline-variant rounded-xl shadow-2xl overflow-hidden animate-deck-shuffle" style={{ animationDelay: '-4s' }}>
        <ScaleWrapper width={1240} height={800}><SettingsView /></ScaleWrapper>
      </div>
      <div className="absolute top-0 left-[50%] w-[90%] md:w-full aspect-[1.55] bg-background border border-outline-variant rounded-xl shadow-2xl overflow-hidden animate-deck-shuffle" style={{ animationDelay: '-8s' }}>
        <ScaleWrapper width={1240} height={800}><ExamplesView /></ScaleWrapper>
      </div>
      <div className="absolute top-0 left-[50%] w-[90%] md:w-full aspect-[1.55] bg-background border border-outline-variant rounded-xl shadow-2xl overflow-hidden animate-deck-shuffle" style={{ animationDelay: '-12s' }}>
        <ScaleWrapper width={1240} height={800}><AboutView /></ScaleWrapper>
      </div>
      <div className="absolute top-0 left-[50%] w-[90%] md:w-full aspect-[1.55] bg-background border border-outline-variant rounded-xl shadow-2xl overflow-hidden animate-deck-shuffle" style={{ animationDelay: '0s' }}>
        <ScaleWrapper width={1240} height={800}><HomeView /></ScaleWrapper>
      </div>
    </>
  );
}
