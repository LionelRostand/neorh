
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface LeaveSummaryCardProps {
  title: string;
  value: number;
  total: number;
  color: string;
}

const LeaveSummaryCard: React.FC<LeaveSummaryCardProps> = ({ title, value, total, color }) => {
  return (
    <Card className="border rounded-lg shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">{title}</span>
          <div className="flex items-end mt-2">
            <span className={`text-2xl font-bold ${color}`}>{value}</span>
            <span className="text-sm text-gray-500 ml-1">/ {total}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface LeaveSummaryCardsProps {
  totalDays: number;
  paidLeavesRemaining: number;
  paidLeavesTotal: number;
  rttRemaining: number;
  rttTotal: number;
}

const LeaveSummaryCards: React.FC<LeaveSummaryCardsProps> = ({
  totalDays,
  paidLeavesRemaining,
  paidLeavesTotal,
  rttRemaining,
  rttTotal
}) => {
  console.log("LeaveSummaryCards rendering with data:", { 
    totalDays, paidLeavesRemaining, paidLeavesTotal, rttRemaining, rttTotal 
  });
  
  // Ensure we have valid values
  const safeTotalDays = isNaN(totalDays) ? 0 : totalDays;
  const safePaidRemaining = isNaN(paidLeavesRemaining) ? 0 : paidLeavesRemaining;
  const safePaidTotal = isNaN(paidLeavesTotal) ? 0 : paidLeavesTotal;
  const safeRttRemaining = isNaN(rttRemaining) ? 0 : rttRemaining;
  const safeRttTotal = isNaN(rttTotal) ? 0 : rttTotal;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <LeaveSummaryCard
        title="Total jours posés"
        value={safeTotalDays}
        total={safeTotalDays}
        color="text-gray-700"
      />
      <LeaveSummaryCard
        title="Congés payés restants"
        value={safePaidRemaining}
        total={safePaidTotal}
        color="text-blue-600"
      />
      <LeaveSummaryCard
        title="RTT restants"
        value={safeRttRemaining}
        total={safeRttTotal}
        color="text-emerald-600"
      />
    </div>
  );
};

export default LeaveSummaryCards;
