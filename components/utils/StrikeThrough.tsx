import React from 'react';

interface StrikeThroughProps {
  children: React.ReactNode;
}
export default function StrikeThrough({ children }: StrikeThroughProps) {
  return <span className="line-through">{children}</span>;
}
