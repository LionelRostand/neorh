
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

const EmployeeTableSkeleton: React.FC = () => {
  return (
    <div>
      <div className="flex gap-4 mb-4">
        <Skeleton className="h-10 w-72" />
        <div className="flex gap-2 ml-auto">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]"><Skeleton className="h-4 w-full" /></TableHead>
              <TableHead><Skeleton className="h-4 w-full" /></TableHead>
              <TableHead><Skeleton className="h-4 w-full" /></TableHead>
              <TableHead className="hidden md:table-cell"><Skeleton className="h-4 w-full" /></TableHead>
              <TableHead className="hidden md:table-cell"><Skeleton className="h-4 w-full" /></TableHead>
              <TableHead className="hidden md:table-cell"><Skeleton className="h-4 w-full" /></TableHead>
              <TableHead className="text-right"><Skeleton className="h-4 w-full" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5).fill(0).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-16" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EmployeeTableSkeleton;
