import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { getResourceContent } from '../utils/helpers';
function ResourceList({ onSelectResource, selectedResource }) {
    const [resources, setResources] = useState([]);
    useEffect(() => {
        fetch('https://localhost:5083/api/resources')
            .then(res => res.json())
            .then(data => setResources(data));
    }, []);
    return (_jsxs("div", { className: "bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm", children: [_jsx("h2", { className: "text-xl font-bold mb-4 text-gray-700", children: "Resurser" }), _jsx("ul", { className: "space-y-2", children: resources.map(r => {
                    const content = getResourceContent(r);
                    const name = content.name || '';
                    const type = content.type || '';
                    const description = content.description || '';
                    const isSelected = selectedResource?.id === r.id;
                    return (_jsxs("li", { onClick: () => onSelectResource(r), className: `px-4 py-2 rounded cursor-pointer border transition-colors duration-150 ${isSelected ? 'bg-blue-600 text-white font-bold border-blue-700' : 'bg-white text-gray-800 border-gray-300 hover:bg-blue-100'}`, style: { userSelect: 'none' }, children: [name, " ", type && `(${type})`, " ", description && `- ${description}`] }, r.id));
                }) })] }));
}
export default ResourceList;
