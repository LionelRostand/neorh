
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ProjectTableSkeleton = () => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Nom</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Responsable</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date de début</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                <Skeleton className="h-5 w-[180px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[150px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[120px]" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-20 rounded-md" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-[100px]" />
              </TableCell>
              <TableCell>
                <div className="flex space-x-1">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectTableSkeleton;
