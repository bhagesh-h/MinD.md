import React, { useEffect, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { useAppearance } from '../lib/appearance';

// Module-level mutex: ensures concurrent Mermaid renders are queued, not raced.
// Racing calls to mermaid.initialize() corrupt internal state and crash the page.
let renderQueue = Promise.resolve();
const queueRender = (fn: () => Promise<void>) => {
  renderQueue = renderQueue.then(fn).catch(() => {});
};


interface MermaidProps {
  chart: string;
}

export const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const config = useAppearance();

  useEffect(() => {
    let isMounted = true;
    const renderChart = async () => {
      if (!ref.current) return;
      
      try {
        const { default: mermaid } = await import('mermaid');
        
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          securityLevel: 'loose',
          fontFamily: 'inherit',
          themeVariables: {
            fontFamily: config.charts?.font || '"Inter", sans-serif',
            fontSize: '15px',
            primaryColor: config.mermaid?.primaryColor || '#7dd3fc',
            primaryTextColor: config.mermaid?.primaryTextColor || '#082f49',
            primaryBorderColor: config.mermaid?.primaryBorderColor || '#38bdf8',
            lineColor: config.mermaid?.lineColor || '#94a3b8',
            secondaryColor: config.mermaid?.secondaryColor || '#fde047',
            tertiaryColor: config.mermaid?.tertiaryColor || '#86efac',
            mainBkg: config.mermaid?.mainBkg || 'transparent',
            nodeBorder: config.mermaid?.nodeBorder || '#0ea5e9',
            clusterBkg: config.mermaid?.clusterBkg || 'rgba(30, 41, 59, 0.5)',
            clusterBorder: config.mermaid?.clusterBorder || '#475569',
            titleColor: config.mermaid?.titleColor || '#e2e8f0',
            edgeLabelBackground: config.mermaid?.edgeLabelBackground || '#0f172a',
            nodeTextColor: config.mermaid?.nodeTextColor || '#0f172a',
            labelTextColor: config.mermaid?.labelTextColor || '#f1f5f9',
            pie1: config.charts?.pie?.[0] || '#7dd3fc',
            pie2: config.charts?.pie?.[1] || '#fde047',
            pie3: config.charts?.pie?.[2] || '#86efac',
            pie4: config.charts?.pie?.[3] || '#fda4af',
            pie5: config.charts?.pie?.[4] || '#d8b4fe',
            pie6: config.charts?.pie?.[5] || '#fbbf24',
            pie7: config.charts?.pie?.[6] || '#f472b6',
            pie8: config.charts?.pie?.[7] || '#a78bfa',
            pieTitleTextSize: '20px',
            pieTitleTextColor: '#f8fafc',
            pieSectionTextSize: '16px',
            pieSectionTextColor: '#0f172a',
            pieLegendTextSize: '15px',
            pieLegendTextColor: '#cbd5e1',
          },
          flowchart: { useMaxWidth: false, htmlLabels: true, curve: 'basis', nodeSpacing: 50, rankSpacing: 50 },
          sequence: { 
            useMaxWidth: false, 
            showSequenceNumbers: true,
            actorMargin: 100,
            boxTextMargin: 10,
            noteMargin: 15,
            messageMargin: 45,
            mirrorActors: true,
          },
          gantt: { useMaxWidth: false },
          er: { useMaxWidth: false },
        });

        setError(null);
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        // Clean up text to avoid rendering issues with newlines
        const cleanChart = chart.trim();
        const { svg: renderedSvg } = await mermaid.render(id, cleanChart);
        
        if (isMounted) {
          setSvg(renderedSvg);
        }
      } catch (err) {
        console.error('Mermaid rendering failed:', err);
        if (isMounted) {
          setError('Failed to render diagram');
        }
      }
    };

    queueRender(() => renderChart());
    
    return () => {
      isMounted = false;
    };
  }, [chart, config]);

  if (error) {
    return <div className="p-4 rounded-lg bg-red-900/20 border border-red-900/50 text-red-400 text-xs font-mono">{error}</div>;
  }

  return (
    <div className="mermaid-outer-wrapper my-6 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] relative group">
      <TransformWrapper
        initialScale={1}
        minScale={0.1}
        maxScale={8}
        centerOnInit
        wheel={{ step: 0.1 }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[#222] p-1 rounded-md border border-white/10 z-10">
              <button title="Zoom Out" onClick={() => zoomOut()} className="p-1.5 hover:bg-white/10 rounded transition-colors"><ZoomOut size={14} className="text-white/70" /></button>
              <button title="Reset Zoom" onClick={() => resetTransform()} className="p-1.5 hover:bg-white/10 rounded transition-colors"><Maximize size={14} className="text-white/70" /></button>
              <button title="Zoom In" onClick={() => zoomIn()} className="p-1.5 hover:bg-white/10 rounded transition-colors"><ZoomIn size={14} className="text-white/70" /></button>
            </div>
            <TransformComponent wrapperClass="!w-full !h-full" contentClass="p-6">
              <div 
                ref={ref} 
                className="mermaid-wrapper flex justify-center w-full"
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};
