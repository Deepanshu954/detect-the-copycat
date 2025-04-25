
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, AlertTriangle, AlertCircle, FileText, Percent } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  const similarityPercentage = Math.round(similarityScore * 100);
  const { level, description } = getSimilarityLevel(similarityScore);
  
  // Choose alert icon and color based on similarity level
  let AlertIcon = Info;
  let progressColor = "bg-blue-500";
  
  if (level === 'medium') {
    AlertIcon = AlertTriangle;
    progressColor = "bg-yellow-500";
  }
  if (level === 'high') {
    AlertIcon = AlertCircle;
    progressColor = "bg-red-500";
  }
  
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Plagiarism Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Similarity Score</span>
                <span className="text-lg font-bold">{similarityPercentage}%</span>
              </div>
              <Progress 
                value={similarityPercentage} 
                className={`h-3 ${progressColor}`} 
              />
            </div>
            
            <Alert className={`bg-opacity-30 ${
              level === 'low' ? 'bg-blue-500 border-blue-500' :
              level === 'medium' ? 'bg-yellow-500 border-yellow-500' :
              'bg-red-500 border-red-500'
            }`}>
              <AlertIcon className="h-4 w-4" />
              <AlertTitle>
                {level === 'low' && 'Low Plagiarism Risk'}
                {level === 'medium' && 'Moderate Plagiarism Risk'}
                {level === 'high' && 'High Plagiarism Risk'}
              </AlertTitle>
              <AlertDescription>{description}</AlertDescription>
            </Alert>

            {matchingSegments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Matching Content Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Match #</TableHead>
                        <TableHead>Original Text</TableHead>
                        <TableHead>Matching Text</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {matchingSegments.map((segment, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>{segment.original}</TableCell>
                          <TableCell>{segment.comparison}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
      
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
