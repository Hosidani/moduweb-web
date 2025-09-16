import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
function ResourceList({ onSelectResource, selectedResourceId }) {
    const [resources, setResources] = useState([]);
    useEffect(() => {
        fetch('https://localhost:5083/api/resources')
            .then(res => res.json())
            .then(data => setResources(data));
    }, []);
    return (_jsxs("div", { className: "bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm", children: [_jsx("h2", { className: "text-xl font-bold mb-4 text-gray-700", children: "Resurser" }), _jsx("ul", { className: "space-y-2", children: resources.map(r => {
                    let content = r.content;
                    if (typeof content === 'string') {
                        try {
                            content = JSON.parse(content);
                        }
                        catch {
                            content = { name: content, type: '', description: '' };
                        }
                    }
                    const isSelected = selectedResourceId === String(r.id);
                    return (_jsxs("li", { onClick: () => onSelectResource(String(r.id)), className: `px-4 py-2 rounded cursor-pointer border transition-colors duration-150 ${isSelected ? 'bg-blue-600 text-white font-bold border-blue-700' : 'bg-white text-gray-800 border-gray-300 hover:bg-blue-100'}`, style: { userSelect: 'none' }, children: [content.name, " ", content.type && `(${content.type})`, " ", content.description && `- ${content.description}`] }, r.id));
                }) })] }));
}
export default ResourceList;
