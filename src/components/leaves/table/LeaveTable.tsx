
import React from "react";
import { Table } from "@/components/ui/table";
import { Leave } from "@/types/firebase";
import LeaveTableHeader from "./LeaveTableHeader";
import LeaveTableBody from "./LeaveTableBody";
import useEmployeeNames from "./useEmployeeNames";

interface LeaveTableProps {
  leaves: Leave[];
  loading: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const LeaveTable = ({ leaves, loading, onApprove, onReject }: LeaveTableProps) => {
  const { employeeNames, managerNames } = useEmployeeNames(leaves);

  return (
    <Table>
      <LeaveTableHeader />
      <LeaveTableBody 
        leaves={leaves}
        loading={loading}
        onApprove={onApprove}
        onReject={onReject}
        employeeNames={employeeNames}
        managerNames={managerNames}
      />
    </Table>
  );
};

export default LeaveTable;
