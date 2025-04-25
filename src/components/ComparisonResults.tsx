
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
  
  const highlightedSegments = matchingSegments.map(segment => segment.comparison);
  
  // Enhanced styling for different similarity levels
  const getLevelStyles = () => {
    switch (level) {
      case 'low':
        return {
          alert: 'bg-green-50 border-green-200',
          progress: 'bg-green-500',
          icon: Info,
          iconColor: 'text-green-500'
        };
      case 'medium':
        return {
          alert: 'bg-yellow-50 border-yellow-200',
          progress: 'bg-yellow-500',
          icon: AlertTriangle,
          iconColor: 'text-yellow-500'
        };
      case 'high':
        return {
          alert: 'bg-red-50 border-red-200',
          progress: 'bg-red-500',
          icon: AlertCircle,
          iconColor: 'text-red-500'
        };
    }
  };

  const styles = getLevelStyles();
  const AlertIcon = styles.icon;
  
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Percent className="h-6 w-6" />
            Plagiarism Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-medium">Similarity Score</span>
                <span className="text-2xl font-bold tabular-nums">
                  {similarityPercentage}%
                </span>
              </div>
              <Progress 
                value={similarityPercentage} 
                className={`h-4 ${styles.progress}`}
              />
              <div className="mt-2 text-sm text-gray-600">
                {similarityPercentage === 100 ? (
                  "Exact match detected"
                ) : similarityPercentage === 0 ? (
                  "No matching content found"
                ) : (
                  `${similarityPercentage}% of content shows similarity`
                )}
              </div>
            </div>
            
            <Alert className={styles.alert}>
              <AlertIcon className={`h-5 w-5 ${styles.iconColor}`} />
              <AlertTitle>
                {level === 'low' && 'Low Similarity Detected'}
                {level === 'medium' && 'Moderate Similarity Detected'}
                {level === 'high' && 'High Similarity Detected'}
              </AlertTitle>
              <AlertDescription className="mt-2">{description}</AlertDescription>
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
                        <TableHead className="w-[100px]">Match #</TableHead>
                        <TableHead>Original Text</TableHead>
                        <TableHead>Matching Text</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {matchingSegments.map((segment, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell className="font-mono text-sm bg-slate-50">
                            {segment.original}
                          </TableCell>
                          <TableCell className="font-mono text-sm bg-slate-50">
                            {segment.comparison}
                          </TableCell>
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
          className="animate-fade-in"
        />
        <TextPreview
          title="Comparison Text"
          text={comparisonText}
          highlightedSegments={highlightedSegments}
          className="animate-fade-in"
        />
      </div>
    </div>
  );
};

export default ComparisonResults;
