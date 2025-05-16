
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { LeaveAllocation } from '@/hooks/leaves';
import AllocationCounter from '../AllocationCounter';

interface AllocationContentProps {
  allocation: LeaveAllocation;
  isEditing: boolean;
  paidLeavesTotal: number;
  rttTotal: number;
  setPaidLeavesTotal: (value: number) => void;
  setRttTotal: (value: number) => void;
}

const AllocationContent: React.FC<AllocationContentProps> = ({
  allocation,
  isEditing,
  paidLeavesTotal,
  rttTotal,
  setPaidLeavesTotal,
  setRttTotal
}) => {
  return (
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AllocationCounter
          id="paid-leaves-total"
          value={paidLeavesTotal}
          onChange={setPaidLeavesTotal}
          isEditing={isEditing}
          label="Congés Payés"
          used={allocation.paidLeavesUsed}
          total={allocation.paidLeavesTotal}
          colorClass="text-blue-700"
          iconBgClass="bg-blue-100"
          iconColorClass="text-blue-600"
        />
        
        <AllocationCounter
          id="rtt-total"
          value={rttTotal}
          onChange={setRttTotal}
          isEditing={isEditing}
          label="RTT"
          used={allocation.rttUsed}
          total={allocation.rttTotal}
          colorClass="text-emerald-700"
          iconBgClass="bg-emerald-100"
          iconColorClass="text-emerald-600"
        />
      </div>
    </CardContent>
  );
};

export default AllocationContent;
