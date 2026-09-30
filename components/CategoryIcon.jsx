'use client';

import React from 'react';
import {
  Utensils,
  Home,
  Zap,
  Car,
  Film,
  HeartPulse,
  GraduationCap,
  ShoppingBag,
  TrendingUp,
  Briefcase,
  Laptop,
  PiggyBank,
  PlusCircle,
  MoreHorizontal,
  CreditCard,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

const iconMap = {
  Utensils,
  Home,
  Zap,
  Car,
  Film,
  HeartPulse,
  GraduationCap,
  ShoppingBag,
  TrendingUp,
  Briefcase,
  Laptop,
  PiggyBank,
  PlusCircle,
  MoreHorizontal,
  CreditCard,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
};

export default function CategoryIcon({ name, className = 'w-4 h-4', color }) {
  const IconComponent = iconMap[name] || MoreHorizontal;
  return <IconComponent className={className} style={color ? { color } : undefined} />;
}
