import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  highlight?: 'success' | 'warning' | 'danger' | 'default';
  onOpen?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, highlight, onOpen }) => {
  const getValueColor = () => {
    switch (highlight) {
      case 'success':
        return 'text-slate-700';
      case 'warning':
        return 'text-slate-600';
      case 'danger':
        return 'text-slate-600';
      default:
        return 'text-slate-800';
    }
  };
  
  return (
    <div className="stat-card group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-slate-500">{title}</div>
          </div>
          <div className={`mt-2 text-2xl font-semibold ${getValueColor()}`}>{value}</div>
        </div>
        
        {onOpen && (
          <div className="ml-4">
            <button 
              onClick={onOpen} 
              className="btn-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              Open
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;