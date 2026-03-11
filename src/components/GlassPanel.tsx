import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const GlassPanel: React.FC<GlassPanelProps> = ({ children, className = '', id }) => {
  return (
    <div
      id={id}
      className={`glass-panel p-6 ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassPanel;
