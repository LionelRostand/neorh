
import React, { memo } from 'react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Clock } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import TimesheetDetailForm from '@/components/timesheet/TimesheetDetailForm';
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

interface TimesheetDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  timesheet: Timesheet | null;
  onClose: () => void;
}

const TimesheetDetailDialog = memo(({ 
  isOpen, 
  onOpenChange, 
  timesheet, 
  onClose 
}: TimesheetDetailDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Détails de la feuille de temps
          </DialogTitle>
          <DialogDescription>
            Période: {timesheet?.weekStartDate && timesheet?.weekEndDate 
              ? `${formatDate(timesheet.weekStartDate)} - ${formatDate(timesheet.weekEndDate)}` 
              : 'Non définie'}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          {timesheet && (
            <TimesheetDetailForm 
              timesheet={timesheet}
              onClose={onClose}
            />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
});

TimesheetDetailDialog.displayName = 'TimesheetDetailDialog';

export default TimesheetDetailDialog;
