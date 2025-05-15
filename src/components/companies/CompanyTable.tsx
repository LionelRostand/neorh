
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CompanyStatusBadge from "./CompanyStatusBadge";
import CompanyActions from "./CompanyActions";

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
  return (
    <div className="overflow-x-auto">
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
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">Chargement...</TableCell>
            </TableRow>
          ) : companies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">Aucune entreprise trouvée</TableCell>
            </TableRow>
          ) : (
            companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                      {company.name?.charAt(0) || '?'}
                    </div>
                    <div className="font-medium">{company.name || 'Entreprise inconnue'}</div>
                  </div>
                </TableCell>
                <TableCell>{company.industry || 'Non spécifié'}</TableCell>
                <TableCell>{company.type}</TableCell>
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
            ))
          )}

          {/* Example rows for demonstration when no companies */}
          {companies.length === 0 && !loading && (
            <>
              <TableRow>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">N</div>
                    <div className="font-medium">NEORH</div>
                  </div>
                </TableCell>
                <TableCell>Informatique</TableCell>
                <TableCell>SARL</TableCell>
                <TableCell>03/05/2025</TableCell>
                <TableCell>
                  <CompanyStatusBadge status="active" />
                </TableCell>
                <TableCell className="text-right">
                  <CompanyActions 
                    companyId="example1" 
                    onDetails={onDetails}
                    onEdit={onEdit}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">?</div>
                    <div className="font-medium">Entreprise inconnue</div>
                  </div>
                </TableCell>
                <TableCell>Non spécifié</TableCell>
                <TableCell>SAS</TableCell>
                <TableCell>—</TableCell>
                <TableCell>
                  <CompanyStatusBadge status="pending" />
                </TableCell>
                <TableCell className="text-right">
                  <CompanyActions 
                    companyId="example2" 
                    onDetails={onDetails}
                    onEdit={onEdit}
                  />
                </TableCell>
              </TableRow>
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompanyTable;
