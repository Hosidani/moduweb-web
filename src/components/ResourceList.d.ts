interface ResourceListProps {
    onSelectResource: (id: string) => void;
    selectedResourceId: string | null;
}
declare function ResourceList({ onSelectResource, selectedResourceId }: ResourceListProps): import("react/jsx-runtime").JSX.Element;
export default ResourceList;
