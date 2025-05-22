
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Contract } from "@/lib/constants";
import ContractStatusBadge from "./ContractStatusBadge";
import ContractActions from "./ContractActions";
import EmployeeCell from "./EmployeeCell";

interface ContractTableProps {
  contracts: Contract[];
  loading: boolean;
  onDetails: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ContractTable = ({ contracts, loading, onDetails, onEdit, onDelete }: ContractTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employé</TableHead>
            <TableHead>Poste</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Début</TableHead>
            <TableHead>Fin</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">Chargement...</TableCell>
            </TableRow>
          ) : contracts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">Aucun contrat trouvé</TableCell>
            </TableRow>
          ) : (
            contracts.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell>
                  <EmployeeCell 
                    employeeId={contract.employeeId || ''} 
                    employeeName={contract.employeeName || 'Employé inconnu'} 
                  />
                </TableCell>
                <TableCell>{contract.position || 'Non spécifié'}</TableCell>
                <TableCell>{contract.type}</TableCell>
                <TableCell>{contract.startDate || '-'}</TableCell>
                <TableCell>{contract.endDate || '—'}</TableCell>
                <TableCell>
                  <ContractStatusBadge status={contract.status} />
                </TableCell>
                <TableCell className="text-right">
                  <ContractActions 
                    contractId={contract.id || ''} 
                    onDetails={onDetails}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </TableCell>
              </TableRow>
            ))
          )}

          {contracts.length === 0 && !loading && (
            <>
              <TableRow>
                <TableCell>
                  <EmployeeCell 
                    employeeId="example1"
                    employeeName="Lionel DJOSSA" 
                  />
                </TableCell>
                <TableCell>PDG</TableCell>
                <TableCell>CDI</TableCell>
                <TableCell>03/05/2025</TableCell>
                <TableCell>—</TableCell>
                <TableCell>
                  <ContractStatusBadge status="active" />
                </TableCell>
                <TableCell className="text-right">
                  <ContractActions 
                    contractId="example1" 
                    onDetails={onDetails}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <EmployeeCell 
                    employeeId="example2"
                    employeeName="Employé inconnu" 
                  />
                </TableCell>
                <TableCell>Non spécifié</TableCell>
                <TableCell>CDI</TableCell>
                <TableCell>—</TableCell>
                <TableCell>—</TableCell>
                <TableCell>
                  <ContractStatusBadge status="active" />
                </TableCell>
                <TableCell className="text-right">
                  <ContractActions 
                    contractId="example2" 
                    onDetails={onDetails}
                    onEdit={onEdit}
                    onDelete={onDelete}
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

export default ContractTable;
