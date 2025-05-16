
import React from "react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Leave } from "@/lib/constants";
import EmployeeCell from "./EmployeeCell";
import LeaveTypeBadge from "./LeaveTypeBadge";
import DateRangeDisplay from "./DateRangeDisplay";
import LeaveStatusBadge from "./LeaveStatusBadge";
import ManagerCell from "./ManagerCell";
import ActionButtons from "./ActionButtons";

interface LeaveTableBodyProps {
  leaves: Leave[];
  loading: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  employeeNames: Record<string, string>;
  managerNames: Record<string, string>;
}

const LeaveTableBody = ({ 
  leaves, 
  loading, 
  onApprove, 
  onReject,
  employeeNames,
  managerNames
}: LeaveTableBodyProps) => {
  if (loading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={6} className="text-center py-10">Chargement...</TableCell>
        </TableRow>
      </TableBody>
    );
  }

  if (leaves.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={6} className="text-center py-10">Aucune demande de congé trouvée</TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {leaves.map((leave) => (
        <TableRow key={leave.id}>
          <TableCell>
            <EmployeeCell 
              employeeId={leave.employeeId} 
              employeeName={employeeNames[leave.employeeId] || ""} 
            />
          </TableCell>
          <TableCell>
            <LeaveTypeBadge type={leave.type} />
          </TableCell>
          <TableCell>
            {leave.startDate && leave.endDate 
              ? <DateRangeDisplay startDate={leave.startDate} endDate={leave.endDate} />
              : <span>Dates manquantes</span>
            }
          </TableCell>
          <TableCell>
            <LeaveStatusBadge status={leave.status} />
          </TableCell>
          <TableCell>
            <ManagerCell 
              managerId={leave.managerId} 
              managerName={leave.managerId ? managerNames[leave.managerId] : undefined} 
            />
          </TableCell>
          <TableCell>
            <ActionButtons
              leaveId={leave.id || ''}
              status={leave.status}
              onApprove={onApprove}
              onReject={onReject}
            />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default LeaveTableBody;
