
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
  return (
    <div className="grid grid-cols-3 gap-4">
      <LeaveSummaryCard
        title="Total jours posés"
        value={totalDays}
        total={totalDays}
        color="text-gray-700"
      />
      <LeaveSummaryCard
        title="Congés payés restants"
        value={paidLeavesRemaining}
        total={paidLeavesTotal}
        color="text-blue-600"
      />
      <LeaveSummaryCard
        title="RTT restants"
        value={rttRemaining}
        total={rttTotal}
        color="text-emerald-600"
      />
    </div>
  );
};

export default LeaveSummaryCards;
