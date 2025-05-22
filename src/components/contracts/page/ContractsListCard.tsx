
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Contract } from "@/lib/constants";
import ContractSearch from "@/components/contracts/ContractSearch";
import ContractTable from "@/components/contracts/ContractTable";

interface ContractsListCardProps {
  contracts: Contract[];
  loading: boolean;
  onRefresh: () => void;
  onDetails: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ContractsListCard: React.FC<ContractsListCardProps> = ({
  contracts,
  loading,
  onRefresh,
  onDetails,
  onEdit,
  onDelete
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter contracts based on search term
  const filteredContracts = contracts.filter(contract => 
    contract.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    contract.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Liste des contrats</h2>
            <Button 
              variant="outline" 
              onClick={onRefresh}
              size="sm"
            >
              Rafraîchir
            </Button>
          </div>
          
          <ContractSearch 
            value={searchTerm}
            onChange={setSearchTerm}
          />

          <ContractTable 
            contracts={filteredContracts}
            loading={loading}
            onDetails={onDetails}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractsListCard;
