
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { RecruitmentPost } from "@/types/recruitment";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RecruitmentListProps {
  posts: RecruitmentPost[];
  onPostClick: (postId: string) => void;
}

const RecruitmentList: React.FC<RecruitmentListProps> = ({ posts, onPostClick }) => {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Département</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date de création</TableHead>
            <TableHead>Candidatures</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map(post => (
            <TableRow 
              key={post.id} 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onPostClick(post.id)}
            >
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell>{post.department}</TableCell>
              <TableCell>
                <StatusBadge status={post.status} />
              </TableCell>
              <TableCell>{format(new Date(post.createdAt), 'dd MMM yyyy', { locale: fr })}</TableCell>
              <TableCell>{post.applications || 0}</TableCell>
            </TableRow>
          ))}
          {posts.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                Aucune offre de recrutement trouvée
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusInfo = () => {
    switch(status) {
      case 'ouverte':
        return { className: 'bg-blue-100 text-blue-800', label: 'Ouverte' };
      case 'en_cours':
        return { className: 'bg-amber-100 text-amber-800', label: 'En cours' };
      case 'entretiens':
        return { className: 'bg-purple-100 text-purple-800', label: 'Entretiens' };
      case 'offre':
        return { className: 'bg-green-100 text-green-800', label: 'Offre' };
      case 'fermée':
        return { className: 'bg-gray-100 text-gray-800', label: 'Fermée' };
      default:
        return { className: 'bg-gray-100 text-gray-800', label: status };
    }
  };

  const { className, label } = getStatusInfo();

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
};

export default RecruitmentList;
