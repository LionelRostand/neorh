
import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RecruitmentPost } from "@/types/recruitment";

interface CandidateCardProps {
  post: RecruitmentPost;
  isConverting: boolean;
  onConvertToEmployee: (post: RecruitmentPost) => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  post,
  isConverting,
  onConvertToEmployee,
}) => {
  if (!post.candidateName) return null;

  const handleConvertToEmployee = () => {
    onConvertToEmployee(post);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidat</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-medium">{post.candidateName}</p>
        {post.nextStep && (
          <p className="text-sm text-gray-600 mt-2">
            <span className="font-medium">Prochaine étape:</span> {post.nextStep}
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleConvertToEmployee}
          disabled={isConverting || post.status !== 'offre'}
        >
          {isConverting ? "Conversion..." : "Convertir en employé"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CandidateCard;
