import React from 'react';
import {
  Compass,
  Lightbulb,
  Trash2,
  Droplets,
  Zap,
  Building2,
  Trees,
  AlertTriangle,
} from 'lucide-react';

interface Props {
  category: string;
  className?: string;
}

export const CategoryIcon: React.FC<Props> = ({ category, className = 'w-5 h-5' }) => {
  const cat = category.toLowerCase();
  if (cat.includes('road') || cat.includes('pothole')) {
    return <Compass className={className} />;
  }
  if (cat.includes('light') || cat.includes('dark')) {
    return <Lightbulb className={className} />;
  }
  if (cat.includes('waste') || cat.includes('garbage')) {
    return <Trash2 className={className} />;
  }
  if (cat.includes('water') || cat.includes('sewage') || cat.includes('drain')) {
    return <Droplets className={className} />;
  }
  if (cat.includes('wire') || cat.includes('electric') || cat.includes('transformer')) {
    return <Zap className={className} />;
  }
  if (cat.includes('infra') || cat.includes('footpath') || cat.includes('pavement')) {
    return <Building2 className={className} />;
  }
  if (cat.includes('tree') || cat.includes('park') || cat.includes('garden')) {
    return <Trees className={className} />;
  }
  return <AlertTriangle className={className} />;
};
