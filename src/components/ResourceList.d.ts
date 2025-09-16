interface Resource {
    id: number;
    content: string;
}
interface ResourceListProps {
    onSelectResource: (resource: Resource) => void;
    selectedResource: Resource | null;
}
declare function ResourceList({ onSelectResource, selectedResource }: ResourceListProps): import("react/jsx-runtime").JSX.Element;
export default ResourceList;
