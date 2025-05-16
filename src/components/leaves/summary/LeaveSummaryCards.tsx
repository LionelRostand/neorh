
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: number;
  subtitle?: string;
  iconBgClass: string;
  iconColorClass: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  iconBgClass, 
  iconColorClass 
}) => (
  <Card className="border rounded-lg shadow-sm">
    <CardContent className="p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h4 className="text-2xl font-bold mt-1">{value}</h4>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-2 rounded-full ${iconBgClass}`}>
          <Calendar className={`h-5 w-5 ${iconColorClass}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <SummaryCard 
        title="Total jours pris"
        value={totalDays}
        iconBgClass="bg-blue-100"
        iconColorClass="text-blue-600"
      />
      
      <SummaryCard 
        title="Congés payés disponibles"
        value={paidLeavesRemaining}
        subtitle={`sur ${paidLeavesTotal} jours`}
        iconBgClass="bg-green-100"
        iconColorClass="text-green-600"
      />
      
      <SummaryCard 
        title="RTT disponibles"
        value={rttRemaining}
        subtitle={`sur ${rttTotal} jours`}
        iconBgClass="bg-amber-100"
        iconColorClass="text-amber-600"
      />
    </div>
  );
};

export default LeaveSummaryCards;
