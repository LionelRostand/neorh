import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import LeaveStatusCards from "./LeaveStatusCards";
import LeaveFilters from "./LeaveFilters";
import LeaveTable from "./table/LeaveTable";
import { Leave } from "@/lib/constants";

interface LeavesContentProps {
  leaves: Leave[];
  loading: boolean;
  statusCounts: {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
  };
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onSearch: (query: string) => void;
}

const LeavesContent = ({ 
  leaves, 
  loading, 
  statusCounts, 
  onApprove, 
  onReject, 
  onSearch 
}: LeavesContentProps) => {
  return (
    <>
      <LeaveStatusCards
        pending={statusCounts.pending}
        approved={statusCounts.approved}
        rejected={statusCounts.rejected}
        total={statusCounts.total}
      />

      <Card>
        <CardContent className="p-0">
          <LeaveFilters onSearch={onSearch} />
          <LeaveTable 
            leaves={leaves} 
            loading={loading} 
            onApprove={onApprove} 
            onReject={onReject} 
          />
        </CardContent>
      </Card>
    </>
  );
};

export default LeavesContent;
