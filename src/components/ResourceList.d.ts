interface Resource {
    id: number;
    content: string;
}
interface ResourceListProps {
    resources: Resource[];
    onSelectResource: (resource: Resource) => void;
    selectedResource: Resource | null;
}
declare function ResourceList({ resources, onSelectResource, selectedResource }: ResourceListProps): import("react/jsx-runtime").JSX.Element;
export default ResourceList;
