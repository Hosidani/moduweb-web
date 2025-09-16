import { useEffect, useState } from 'react';

interface Resource {
  id: number;
  content: string;
}

interface ResourceListProps {
  onSelectResource: (id: string) => void;
  selectedResourceId: string | null;
}

function ResourceList({ onSelectResource, selectedResourceId }: ResourceListProps) {
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    fetch('https://localhost:5083/api/resources')
      .then(res => res.json())
      .then(data => setResources(data));
  }, []);

  return (
    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Resurser</h2>
      <ul className="space-y-2">
        {resources.map(r => {
          let content: any = r.content;
          if (typeof content === 'string') {
            try {
              content = JSON.parse(content);
            } catch {
              content = { name: content, type: '', description: '' };
            }
          }
          const isSelected = selectedResourceId === String(r.id);
          return (
            <li
              key={r.id}
              onClick={() => onSelectResource(String(r.id))}
              className={`px-4 py-2 rounded cursor-pointer border transition-colors duration-150 ${isSelected ? 'bg-blue-600 text-white font-bold border-blue-700' : 'bg-white text-gray-800 border-gray-300 hover:bg-blue-100'}`}
              style={{ userSelect: 'none' }}
            >
              {content.name} {content.type && `(${content.type})`} {content.description && `- ${content.description}`}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ResourceList;