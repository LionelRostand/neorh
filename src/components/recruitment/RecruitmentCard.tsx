
import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from '@dnd-kit/utilities';
import { Calendar, MapPin, Users } from "lucide-react";
import { RecruitmentPost } from "@/types/recruitment";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RecruitmentCardProps {
  post: RecruitmentPost;
  onClick: () => void;
}

const RecruitmentCard: React.FC<RecruitmentCardProps> = ({ post, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: post.id
  });
  
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };
  
  const createdDate = new Date(post.createdAt);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true, locale: fr });
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white p-3 rounded-md shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow duration-200 border border-gray-200"
    >
      <div onClick={onClick} className="cursor-pointer">
        <h4 className="font-medium text-sm mb-1 truncate">{post.title}</h4>
        <p className="text-xs text-gray-600 mb-2 truncate">{post.department}</p>
        
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
          <Calendar className="h-3 w-3" />
          <span>{timeAgo}</span>
        </div>
        
        {post.location && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{post.location}</span>
          </div>
        )}
        
        {(post.applications !== undefined && post.applications > 0) && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Users className="h-3 w-3" />
            <span>{post.applications} candidat{post.applications > 1 ? 's' : ''}</span>
          </div>
        )}
        
        {post.candidateName && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="flex items-center">
              <div className="h-4 w-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2 text-xs">
                <Users className="h-3 w-3" />
              </div>
              <span className="text-xs font-medium truncate">{post.candidateName}</span>
            </div>
          </div>
        )}
        
        {post.priority && (
          <div className="absolute top-2 right-2">
            <div className={`h-2 w-2 rounded-full ${
              post.priority === 'high' 
                ? 'bg-red-500' 
                : post.priority === 'medium' 
                  ? 'bg-yellow-500' 
                  : 'bg-blue-500'
            }`} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruitmentCard;
