
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import ComparisonResults from '@/components/ComparisonResults';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { compareTexts, checkApiHealth } from '@/utils/apiClient';

const Index = () => {
  const [originalText, setOriginalText] = useState<string>('');
  const [comparisonText, setComparisonText] = useState<string>('');
  const [similarityScore, setSimilarityScore] = useState<number>(0);
  const [hasResults, setHasResults] = useState(false);
  const [matchingSegments, setMatchingSegments] = useState<Array<{original: string, comparison: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [usingBackend, setUsingBackend] = useState(true);
  const { toast } = useToast();

  // Check if backend is available on component mount
  useEffect(() => {
    const checkBackend = async () => {
      const isAvailable = await checkApiHealth();
      setUsingBackend(isAvailable);
      
      if (!isAvailable) {
        toast({
          title: "Backend Connection Issue",
          description: "Using browser-based analysis as fallback. For better results, ensure the C++ backend is running.",
          variant: "destructive"
        });
      }
    };
    
    checkBackend();
  }, [toast]);

  const handleCompare = async (originalText: string, comparisonText: string) => {
    setIsLoading(true);
    
    try {
      // Use the API client to compare texts
      const result = await compareTexts(originalText, comparisonText);
      
      // Update state with results
      setOriginalText(originalText);
      setComparisonText(comparisonText);
      setSimilarityScore(result.similarityScore);
      setMatchingSegments(result.matchingSegments);
      setHasResults(true);
      
      toast({
        title: "Analysis Complete",
        description: `Similarity score: ${(result.similarityScore * 100).toFixed(1)}%`,
      });
    } catch (error) {
      console.error('Error during comparison:', error);
      toast({
        title: "Error",
        description: "Failed to analyze texts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
            <div className="flex flex-wrap justify-between items-center gap-4">
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Upload
              </Button>
              
              <h2 className="text-2xl font-semibold">Plagiarism Detection Results</h2>
              
              <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                {usingBackend ? 'Using C++ Engine' : 'Using Browser Engine'}
              </div>
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
              {!usingBackend && (
                <div className="mt-4 text-sm bg-yellow-50 text-yellow-800 p-3 rounded-md border border-yellow-200">
                  Running in fallback mode with browser-based analysis. 
                  For optimal performance, please ensure the C++ backend server is running.
                </div>
              )}
            </div>
            
            <FileUpload onCompare={handleCompare} isLoading={isLoading} />
          </div>
        )}
      </main>
      
      <footer className="bg-gray-100 py-4 text-center text-sm text-muted-foreground">
        <p>Plagiarism Detection System © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;
