interface AvailabilityListProps {
    resourceContent: string;
    onSlotClick?: (slotTime: string, slotId: string, slotIndex: number) => void;
    showBookingDetails?: boolean;
}
declare const AvailabilityList: React.FC<AvailabilityListProps>;
export default AvailabilityList;
