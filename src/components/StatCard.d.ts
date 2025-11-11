import React from 'react';
interface StatCardProps {
    title: string;
    value: string;
    highlight?: 'success' | 'warning' | 'danger' | 'default';
    onOpen?: () => void;
}
declare const StatCard: React.FC<StatCardProps>;
export default StatCard;
