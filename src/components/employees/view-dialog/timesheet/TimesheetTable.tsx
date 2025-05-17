
import React, { memo } from 'react';
import { format } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Timesheet } from '@/lib/constants';

// Helper function to format date
const formatDate = (date: string): string => {
  try {
    return format(new Date(date), 'dd/MM/yyyy');
  } catch (e) {
    console.error('Error formatting date:', e);
    return 'Date invalide';
  }
};

interface TimesheetTableProps {
  timesheets: Timesheet[];
  onViewTimesheet: (timesheet: Timesheet) => void;
}

const TimesheetTable = memo(({ timesheets, onViewTimesheet }: TimesheetTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Période</TableHead>
          <TableHead>Projet</TableHead>
          <TableHead>Heures</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Soumis le</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {timesheets.map((timesheet) => (
          <TableRow 
            key={timesheet.id} 
            className="cursor-pointer hover:bg-gray-50" 
            onClick={() => onViewTimesheet(timesheet)}
          >
            <TableCell>
              {timesheet.weekStartDate && timesheet.weekEndDate 
                ? `${formatDate(timesheet.weekStartDate)} - ${formatDate(timesheet.weekEndDate)}` 
                : 'Non défini'}
            </TableCell>
            <TableCell>{timesheet.projectId || 'Non assigné'}</TableCell>
            <TableCell>{timesheet.hours || 0}h</TableCell>
            <TableCell>
              <Badge 
                variant={timesheet.status === 'approved' ? 'default' : 
                        timesheet.status === 'rejected' ? 'destructive' : 
                        'outline'}
              >
                {timesheet.status === 'submitted' ? 'En attente' : 
                 timesheet.status === 'approved' ? 'Approuvé' : 
                 timesheet.status === 'rejected' ? 'Rejeté' : 'Brouillon'}
              </Badge>
            </TableCell>
            <TableCell>
              {timesheet.submittedAt ? formatDate(timesheet.submittedAt) : 'Non soumis'}
            </TableCell>
            <TableCell className="text-right">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  onViewTimesheet(timesheet);
                }}
              >
                <Calendar className="h-4 w-4 mr-1" />
                Modifier
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});

TimesheetTable.displayName = 'TimesheetTable';

export default TimesheetTable;
