'use client';

import { Leaf, Wine, MapPin, Zap, Landmark, LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  leaf: Leaf,
  wine: Wine,
  'map-pin': MapPin,
  zap: Zap,
  landmark: Landmark,
};

interface CategoryIconProps {
  icon: string;
  size?: number;
  className?: string;
  color?: string;
}

export default function CategoryIcon({ icon, size = 20, className = '', color }: CategoryIconProps) {
  const IconComponent = iconMap[icon];

  if (!IconComponent) {
    return null;
  }

  return (
    <IconComponent
      size={size}
      className={className}
      style={color ? { color } : undefined}
    />
  );
}
