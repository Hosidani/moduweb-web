import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const StatCard = ({ title, value, highlight, onOpen }) => {
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
    return (_jsx("div", { className: "stat-card group", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "flex items-center gap-2", children: _jsx("div", { className: "text-sm font-medium text-slate-500", children: title }) }), _jsx("div", { className: `mt-2 text-2xl font-semibold ${getValueColor()}`, children: value })] }), onOpen && (_jsx("div", { className: "ml-4", children: _jsx("button", { onClick: onOpen, className: "btn-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-200", children: "Open" }) }))] }) }));
};
export default StatCard;
