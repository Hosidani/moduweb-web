import { useEffect, useState } from 'react';
import { getResourceContent } from '../utils/helpers';

interface Resource {
  id: number;
  content: string;
}

interface ResourceListProps {
  onSelectResource: (resource: Resource) => void;
  selectedResource: Resource | null;
}

function ResourceList({ onSelectResource, selectedResource }: ResourceListProps) {
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
        {resources
          .filter(r => {
            const content = getResourceContent(r);
            return content && Array.isArray(content.availabilities) && content.availabilities.length > 0;
          })
          .map(r => {
            const content = getResourceContent(r);
            const name = content.name || '';
            const type = content.type || '';
            const description = content.description || '';

            const isSelected = selectedResource?.id === r.id;
            return (
              <li
                key={r.id}
                onClick={() => onSelectResource(r)}
                className={`px-4 py-2 rounded cursor-pointer border transition-colors duration-150 ${isSelected ? 'bg-blue-600 text-white font-bold border-blue-700' : 'bg-white text-gray-800 border-gray-300 hover:bg-blue-100'}`}
                style={{ userSelect: 'none' }}
              >
                {name} {type && `(${type})`} {description && `- ${description}`}
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default ResourceList;