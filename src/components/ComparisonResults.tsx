
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, AlertTriangle, AlertCircle } from 'lucide-react';
import TextPreview from './TextPreview';
import { getSimilarityLevel } from '@/utils/plagiarismUtils';

interface ComparisonResultsProps {
  originalText: string;
  comparisonText: string;
  similarityScore: number;
  matchingSegments: Array<{original: string, comparison: string}>;
}

const ComparisonResults: React.FC<ComparisonResultsProps> = ({
  originalText,
  comparisonText,
  similarityScore,
  matchingSegments,
}) => {
  // Convert similarity to percentage
  const similarityPercentage = Math.round(similarityScore * 100);
  const { level, description } = getSimilarityLevel(similarityScore);
  
  // Choose alert icon based on similarity level
  let AlertIcon = Info;
  if (level === 'medium') AlertIcon = AlertTriangle;
  if (level === 'high') AlertIcon = AlertCircle;
  
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Similarity Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Similarity Score</span>
                <span className="text-sm font-bold">{similarityPercentage}%</span>
              </div>
              <Progress value={similarityPercentage} className={`h-2 similarity-level-${level}`} />
            </div>
            
            <Alert className={`bg-opacity-30 similarity-level-${level}`}>
              <AlertIcon className="h-4 w-4" />
              <AlertTitle>
                {level === 'low' && 'Low similarity detected'}
                {level === 'medium' && 'Moderate similarity detected'}
                {level === 'high' && 'High similarity detected'}
              </AlertTitle>
              <AlertDescription>
                {description}
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
      
      {matchingSegments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Matching Content Samples</h3>
          
          <div className="grid lg:grid-cols-2 gap-4">
            {matchingSegments.map((segment, index) => (
              <div key={index} className="grid md:grid-cols-2 gap-4">
                <TextPreview 
                  title={`Original Text (Sample ${index + 1})`}
                  text={segment.original} 
                />
                <TextPreview 
                  title={`Comparison Text (Sample ${index + 1})`}
                  text={segment.comparison} 
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-6">
        <TextPreview
          title="Original Text"
          text={originalText}
          className="max-h-[400px] overflow-hidden"
        />
        <TextPreview
          title="Comparison Text"
          text={comparisonText} 
          className="max-h-[400px] overflow-hidden"
        />
      </div>
    </div>
  );
};

export default ComparisonResults;
