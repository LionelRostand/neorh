
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CompanyStatusBadge from "./CompanyStatusBadge";
import CompanyActions from "./CompanyActions";
import { Loader2 } from "lucide-react";

interface Company {
  id?: string;
  name: string;
  industry: string;
  type: string;
  registrationDate: string;
  status: string;
}

interface CompanyTableProps {
  companies: Company[];
  loading: boolean;
  onDetails: (id: string) => void;
  onEdit: (id: string) => void;
}

const CompanyTable = ({ companies, loading, onDetails, onEdit }: CompanyTableProps) => {
  const renderTableContent = () => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center">
            <div className="flex justify-center items-center">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Chargement des données...</span>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (companies.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center">
            <div className="flex flex-col items-center justify-center">
              <p className="text-muted-foreground">Aucune entreprise trouvée</p>
              <p className="text-sm text-muted-foreground">Ajoutez une nouvelle entreprise ou modifiez vos critères de recherche</p>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return companies.map((company) => (
      <TableRow key={company.id || Math.random().toString()}>
        <TableCell>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
              {company.name?.charAt(0) || '?'}
            </div>
            <div className="font-medium">{company.name || 'Entreprise inconnue'}</div>
          </div>
        </TableCell>
        <TableCell>{company.industry || 'Non spécifié'}</TableCell>
        <TableCell>{company.type || 'Non spécifié'}</TableCell>
        <TableCell>{company.registrationDate || '-'}</TableCell>
        <TableCell>
          <CompanyStatusBadge status={company.status} />
        </TableCell>
        <TableCell className="text-right">
          <CompanyActions 
            companyId={company.id || ''} 
            onDetails={onDetails}
            onEdit={onEdit}
          />
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Entreprise</TableHead>
            <TableHead>Secteur</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date d'enregistrement</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {renderTableContent()}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompanyTable;
