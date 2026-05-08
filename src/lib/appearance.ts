
const DEFAULT_TAG_COLORS = [
  '#7dd3fc',
  '#fde047',
  '#86efac',
  '#fda4af',
  '#d8b4fe',
  '#fbbf24',
  '#f472b6',
  '#a78bfa'
];

export function getAppearanceConfig() {
  const savedConfig = localStorage.getItem('appearance_json_data');
  if (savedConfig) {
    try {
      return JSON.parse(savedConfig);
    } catch (e) {
      return null;
    }
  }
  return null;
}

const APPEARANCE_EVENT = 'appearance-update';

export function notifyAppearanceUpdate() {
  window.dispatchEvent(new CustomEvent(APPEARANCE_EVENT));
}

import { useState, useEffect } from 'react';

const DEFAULT_APPEARANCE_CONFIG = {
  theme: 'dark',
  colors: {
    primary: '#7dd3fc',
    secondary: '#fde047',
    tertiary: '#86efac',
    background: 'transparent',
    text: '#0f172a',
    border: '#0ea5e9'
  },
  mermaid: {
    primaryColor: '#7dd3fc',
    primaryTextColor: '#082f49',
    primaryBorderColor: '#38bdf8',
    lineColor: '#94a3b8',
    secondaryColor: '#fde047',
    tertiaryColor: '#86efac',
    mainBkg: 'transparent',
    nodeBorder: '#0ea5e9',
    clusterBkg: 'rgba(30, 41, 59, 0.5)',
    clusterBorder: '#475569',
    titleColor: '#ee2e8f0',
    edgeLabelBackground: '#0f172a',
    nodeTextColor: '#0f172a',
    labelTextColor: '#f1f5f9'
  },
  charts: {
    pie: ['#7dd3fc', '#fde047', '#86efac', '#fda4af', '#d8b4fe'],
    font: '"Inter", sans-serif'
  },
  callouts: {
    note: { background: '#f0f7fb', text: '#000000', border: '#447099' },
    tip: { background: '#eefaef', text: '#000000', border: '#027a38' },
    warning: { background: '#fff9ed', text: '#000000', border: '#d9971c' },
    caution: { background: '#fff5f0', text: '#000000', border: '#cc5500' },
    important: { background: '#fcecec', text: '#000000', border: '#cc0000' }
  },
  tags: DEFAULT_TAG_COLORS
};

export function useAppearance() {
  const [config, setConfig] = useState(getAppearanceConfig());

  useEffect(() => {
    const handler = () => {
      setConfig(getAppearanceConfig());
    };
    window.addEventListener(APPEARANCE_EVENT, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(APPEARANCE_EVENT, handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  return config || DEFAULT_APPEARANCE_CONFIG;
}

export function useTagColor(tag: string) {
  const config = useAppearance();
  const colors = config?.tags || DEFAULT_TAG_COLORS;
  
  if (!colors || colors.length === 0) return '#a3a3a3';

  // Stable hash for the tag string to ensure wider distribution
  // We use a bit more salt to make it pickier with case and near matches
  let hash = 5381;
  const tagStr = tag.toLowerCase().trim(); // Normalize for hash base
  
  for (let i = 0; i < tagStr.length; i++) {
    hash = ((hash << 5) + hash) + tagStr.charCodeAt(i);
  }
  
  // Use the original tag length to differentiate case-normalized matches slightly
  const finalHash = Math.abs(hash * tag.length + tag.charCodeAt(0)) >>> 0;
  const index = finalHash % colors.length;
  
  return colors[index];
}

export function getTagColor(tag: string) {
  const config = getAppearanceConfig();
  const colors = config?.tags || DEFAULT_TAG_COLORS;
  
  if (!colors || colors.length === 0) return '#a3a3a3';

  // Stable hash for the tag string to ensure wider distribution
  // We use a bit more salt to make it pickier with case and near matches
  let hash = 5381;
  const tagStr = tag.toLowerCase().trim(); // Normalize for hash base
  
  for (let i = 0; i < tagStr.length; i++) {
    hash = ((hash << 5) + hash) + tagStr.charCodeAt(i);
  }
  
  // Use the original tag length to differentiate case-normalized matches slightly
  const finalHash = Math.abs(hash * tag.length + tag.charCodeAt(0)) >>> 0;
  const index = finalHash % colors.length;
  
  return colors[index];
}
