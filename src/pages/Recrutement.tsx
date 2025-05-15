
import React, { useState } from "react";
import { 
  Briefcase, 
  Clock, 
  Check, 
  Users, 
  Calendar, 
  Kanban, 
  List, 
  PlusCircle 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import RecruitmentStatusCard from "@/components/recruitment/RecruitmentStatusCard";
import JobCard from "@/components/recruitment/JobCard";

interface RecruitmentStatus {
  openPositions: number;
  inProgress: number;
  filledPositions: number;
  applications: number;
  interviews: number;
}

interface JobPosting {
  id: string;
  title: string;
  department: string;
  status: 'ouverte' | 'en_cours' | 'entretiens' | 'offre' | 'fermée';
}

const Recrutement = () => {
  const [status] = useState<RecruitmentStatus>({
    openPositions: 0,
    inProgress: 1,
    filledPositions: 0,
    applications: 0,
    interviews: 0
  });

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  
  const [jobs] = useState<JobPosting[]>([
    {
      id: "1",
      title: "RH",
      department: "TEST",
      status: "entretiens"
    }
  ]);
  
  const getStatusCounts = (status: string) => {
    return jobs.filter(job => job.status === status).length;
  };

  const handleJobClick = (jobId: string) => {
    console.log(`Job ${jobId} clicked`);
    // In a real application, this would open a modal or navigate to job details
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Recrutement</h1>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouvelle offre
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <RecruitmentStatusCard 
          title="Postes ouverts" 
          count={status.openPositions} 
          icon={<Briefcase className="h-5 w-5 text-blue-600" />} 
          bgColor="bg-blue-100" 
          subtitle="Offres publiées"
        />
        <RecruitmentStatusCard 
          title="En cours" 
          count={status.inProgress} 
          icon={<Clock className="h-5 w-5 text-amber-600" />} 
          bgColor="bg-amber-100" 
          subtitle="Processus actifs"
        />
        <RecruitmentStatusCard 
          title="Postes pourvus" 
          count={status.filledPositions} 
          icon={<Check className="h-5 w-5 text-green-600" />} 
          bgColor="bg-green-100" 
          subtitle="Recrutements terminés"
        />
        <RecruitmentStatusCard 
          title="Candidatures" 
          count={status.applications} 
          icon={<Users className="h-5 w-5 text-purple-600" />} 
          bgColor="bg-purple-100" 
          subtitle="Reçues au total"
        />
        <RecruitmentStatusCard 
          title="Entretiens" 
          count={status.interviews} 
          icon={<Calendar className="h-5 w-5 text-indigo-600" />} 
          bgColor="bg-indigo-100" 
          subtitle="Programmés"
        />
      </div>
      
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'kanban' | 'list')}>
        <div className="flex items-center gap-2 mb-4">
          <TabsList>
            <TabsTrigger value="kanban">
              <Kanban className="h-4 w-4 mr-2" />
              Kanban
            </TabsTrigger>
            <TabsTrigger value="list">
              <List className="h-4 w-4 mr-2" />
              Liste
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="kanban">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-gray-100 rounded-md p-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Ouverte</h3>
                <span className="bg-gray-200 text-gray-800 rounded-full px-2 py-0.5 text-xs">
                  {getStatusCounts('ouverte')}
                </span>
              </div>
              {jobs.filter(job => job.status === 'ouverte').map(job => (
                <JobCard 
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  department={job.department}
                  onClick={() => handleJobClick(job.id)}
                />
              ))}
            </div>
            
            <div className="bg-gray-100 rounded-md p-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">En cours</h3>
                <span className="bg-gray-200 text-gray-800 rounded-full px-2 py-0.5 text-xs">
                  {getStatusCounts('en_cours')}
                </span>
              </div>
              {jobs.filter(job => job.status === 'en_cours').map(job => (
                <JobCard 
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  department={job.department}
                  onClick={() => handleJobClick(job.id)}
                />
              ))}
            </div>
            
            <div className="bg-gray-100 rounded-md p-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Entretiens</h3>
                <span className="bg-gray-200 text-gray-800 rounded-full px-2 py-0.5 text-xs">
                  {getStatusCounts('entretiens')}
                </span>
              </div>
              {jobs.filter(job => job.status === 'entretiens').map(job => (
                <JobCard 
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  department={job.department}
                  onClick={() => handleJobClick(job.id)}
                />
              ))}
            </div>
            
            <div className="bg-gray-100 rounded-md p-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Offre</h3>
                <span className="bg-gray-200 text-gray-800 rounded-full px-2 py-0.5 text-xs">
                  {getStatusCounts('offre')}
                </span>
              </div>
              {jobs.filter(job => job.status === 'offre').map(job => (
                <JobCard 
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  department={job.department}
                  onClick={() => handleJobClick(job.id)}
                />
              ))}
            </div>
            
            <div className="bg-gray-100 rounded-md p-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Fermée</h3>
                <span className="bg-gray-200 text-gray-800 rounded-full px-2 py-0.5 text-xs">
                  {getStatusCounts('fermée')}
                </span>
              </div>
              {jobs.filter(job => job.status === 'fermée').map(job => (
                <JobCard 
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  department={job.department}
                  onClick={() => handleJobClick(job.id)}
                />
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="list">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map(job => (
                  <TableRow 
                    key={job.id} 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleJobClick(job.id)}
                  >
                    <TableCell>{job.id}</TableCell>
                    <TableCell>{job.title}</TableCell>
                    <TableCell>{job.department}</TableCell>
                    <TableCell>
                      <span className={`
                        inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                        ${job.status === 'ouverte' ? 'bg-blue-100 text-blue-800' : ''}
                        ${job.status === 'en_cours' ? 'bg-amber-100 text-amber-800' : ''}
                        ${job.status === 'entretiens' ? 'bg-purple-100 text-purple-800' : ''}
                        ${job.status === 'offre' ? 'bg-green-100 text-green-800' : ''}
                        ${job.status === 'fermée' ? 'bg-gray-100 text-gray-800' : ''}
                      `}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1).replace('_', ' ')}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Recrutement;
