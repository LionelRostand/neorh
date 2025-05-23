
import { Users, Award, GraduationCap, CalendarCheck2 } from "lucide-react";
import { Event } from "./types";

interface EventIconProps {
  type: Event['type'];
}

export const EventIcon = ({ type }: EventIconProps) => {
  switch (type) {
    case 'meeting':
      return <Users className="h-5 w-5 text-blue-500" />;
    case 'training':
      return <GraduationCap className="h-5 w-5 text-green-500" />;
    case 'evaluation':
      return <Award className="h-5 w-5 text-purple-500" />;
    default:
      return <CalendarCheck2 className="h-5 w-5 text-gray-500" />;
  }
};
