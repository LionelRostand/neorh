
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import LeaveStatusCards from "./LeaveStatusCards";
import LeaveFilters from "./LeaveFilters";
import LeaveTable from "./table/LeaveTable";
import LeaveTypesList from "./types/LeaveTypesList";
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-1">
          <LeaveTypesList />
        </div>
        <div className="md:col-span-3">
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
        </div>
      </div>
    </>
  );
};

export default LeavesContent;
