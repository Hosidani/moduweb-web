import React from 'react';
interface Resource {
    id: number;
    content: string;
}
interface AvailabilityListProps {
    resourceContent: string;
    allResources: Resource[];
    onSlotClick?: (slotTime: string, slotId: string, slotIndex: number) => void;
    showBookingDetails?: boolean;
}
declare const AvailabilityList: React.FC<AvailabilityListProps>;
export default AvailabilityList;
