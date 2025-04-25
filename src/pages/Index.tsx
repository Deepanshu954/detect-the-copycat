
import React, { useState } from 'react';
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import ComparisonResults from '@/components/ComparisonResults';
import { compareTexts, findMatchingSegments } from '@/utils/plagiarismUtils';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Index = () => {
  const [originalText, setOriginalText] = useState<string>('');
  const [comparisonText, setComparisonText] = useState<string>('');
  const [similarityScore, setSimilarityScore] = useState<number>(0);
  const [hasResults, setHasResults] = useState(false);
  const [matchingSegments, setMatchingSegments] = useState<Array<{original: string, comparison: string}>>([]);

  const handleCompare = (originalText: string, comparisonText: string) => {
    // Calculate similarity score
    const score = compareTexts(originalText, comparisonText);
    
    // Find matching segments
    const segments = findMatchingSegments(originalText, comparisonText);
    
    // Update state with results
    setOriginalText(originalText);
    setComparisonText(comparisonText);
    setSimilarityScore(score);
    setMatchingSegments(segments);
    setHasResults(true);
  };

  const handleReset = () => {
    setHasResults(false);
    setOriginalText('');
    setComparisonText('');
    setSimilarityScore(0);
    setMatchingSegments([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {hasResults ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Upload
              </Button>
              
              <h2 className="text-2xl font-semibold">Plagiarism Detection Results</h2>
            </div>
            
            <ComparisonResults
              originalText={originalText}
              comparisonText={comparisonText}
              similarityScore={similarityScore}
              matchingSegments={matchingSegments}
            />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Plagiarism Detection Tool</h2>
              <p className="text-muted-foreground">
                Upload or paste the original text and the text you want to compare against. 
                Our advanced algorithms will analyze both texts and identify similarities.
              </p>
            </div>
            
            <FileUpload onCompare={handleCompare} />
          </div>
        )}
      </main>
      
      <footer className="bg-gray-100 py-4 text-center text-sm text-muted-foreground">
        <p>Detect the Copycat © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;
