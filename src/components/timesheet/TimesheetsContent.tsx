
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Timesheet } from "@/lib/constants";
import TimesheetStatusCards from './TimesheetStatusCards';
import TimesheetsTable from './TimesheetsTable';

interface TimesheetsContentProps {
  timesheets: Timesheet[];
  loading: boolean;
  countByStatus: {
    draft: number;
    submitted: number;
    approved: number;
    rejected: number;
  };
  onRefresh?: () => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const TimesheetsContent = ({ 
  timesheets, 
  loading, 
  countByStatus,
  onRefresh,
  onApprove,
  onReject
}: TimesheetsContentProps) => {
  const [filter, setFilter] = useState<"all" | "draft" | "submitted" | "approved" | "rejected">("all");

  const filteredTimesheets = filter === "all" 
    ? timesheets 
    : timesheets.filter(t => t.status === filter);

  return (
    <>
      <TimesheetStatusCards 
        drafts={countByStatus.draft}
        submitted={countByStatus.submitted}
        approved={countByStatus.approved}
        rejected={countByStatus.rejected}
      />

      <Card className="mt-6">
        <Tabs defaultValue="all" onValueChange={(value) => setFilter(value as any)}>
          <TabsList className="bg-transparent border-b rounded-none p-0 w-full flex">
            <TabsTrigger value="all" className="rounded-t-lg rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3">
              Toutes les feuilles ({timesheets.length})
            </TabsTrigger>
            <TabsTrigger value="draft" className="rounded-t-lg rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3">
              Brouillons ({countByStatus.draft})
            </TabsTrigger>
            <TabsTrigger value="submitted" className="rounded-t-lg rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3">
              Soumises ({countByStatus.submitted})
            </TabsTrigger>
            <TabsTrigger value="approved" className="rounded-t-lg rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3">
              Approuvées ({countByStatus.approved})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="rounded-t-lg rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3">
              Rejetées ({countByStatus.rejected})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="p-0 m-0">
            <TimesheetsTable 
              timesheets={filteredTimesheets} 
              loading={loading} 
              onRefresh={onRefresh} 
              onApprove={onApprove}
              onReject={onReject}
            />
          </TabsContent>
          <TabsContent value="draft" className="p-0 m-0">
            <TimesheetsTable 
              timesheets={filteredTimesheets} 
              loading={loading} 
              onRefresh={onRefresh}
              onApprove={onApprove}
              onReject={onReject}
            />
          </TabsContent>
          <TabsContent value="submitted" className="p-0 m-0">
            <TimesheetsTable 
              timesheets={filteredTimesheets} 
              loading={loading} 
              onRefresh={onRefresh}
              onApprove={onApprove}
              onReject={onReject}
            />
          </TabsContent>
          <TabsContent value="approved" className="p-0 m-0">
            <TimesheetsTable 
              timesheets={filteredTimesheets} 
              loading={loading} 
              onRefresh={onRefresh}
              onApprove={onApprove}
              onReject={onReject}
            />
          </TabsContent>
          <TabsContent value="rejected" className="p-0 m-0">
            <TimesheetsTable 
              timesheets={filteredTimesheets} 
              loading={loading} 
              onRefresh={onRefresh}
              onApprove={onApprove}
              onReject={onReject}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </>
  );
};

export default TimesheetsContent;
