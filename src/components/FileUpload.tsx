
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onCompare: (originalText: string, comparisonText: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onCompare }) => {
  const [originalText, setOriginalText] = useState('');
  const [comparisonText, setComparisonText] = useState('');
  const { toast } = useToast();

  const handleTextUpload = (e: React.ChangeEvent<HTMLInputElement>, isOriginal: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Only accept text files
    if (file.type !== 'text/plain') {
      toast({
        title: "Invalid file type",
        description: "Please upload a plain text (.txt) file only.",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (isOriginal) {
        setOriginalText(content);
      } else {
        setComparisonText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleCompare = () => {
    if (originalText.trim() === '' || comparisonText.trim() === '') {
      toast({
        title: "Missing content",
        description: "Please provide both original and comparison texts.",
        variant: "destructive"
      });
      return;
    }

    onCompare(originalText, comparisonText);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text">Enter Text</TabsTrigger>
          <TabsTrigger value="file">Upload Files</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Original Text</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Enter or paste the original text here..."
                  className="min-h-[250px]"
                  value={originalText}
                  onChange={(e) => setOriginalText(e.target.value)}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Comparison Text</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Enter or paste the text you want to compare against..."
                  className="min-h-[250px]"
                  value={comparisonText}
                  onChange={(e) => setComparisonText(e.target.value)}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="file">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Original Document</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <div className="p-8 border-2 border-dashed border-muted rounded-lg text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium text-muted-foreground">Upload plain text (.txt) file</p>
                  <input 
                    type="file" 
                    accept=".txt"
                    onChange={(e) => handleTextUpload(e, true)}
                    className="mt-4 block w-full text-sm text-muted-foreground 
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary file:text-primary-foreground
                    hover:file:bg-primary/90"
                  />
                  {originalText && (
                    <p className="mt-2 text-xs text-green-500">File loaded! ({originalText.length} characters)</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Comparison Document</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <div className="p-8 border-2 border-dashed border-muted rounded-lg text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium text-muted-foreground">Upload plain text (.txt) file</p>
                  <input 
                    type="file" 
                    accept=".txt"
                    onChange={(e) => handleTextUpload(e, false)}
                    className="mt-4 block w-full text-sm text-muted-foreground 
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary file:text-primary-foreground
                    hover:file:bg-primary/90"
                  />
                  {comparisonText && (
                    <p className="mt-2 text-xs text-green-500">File loaded! ({comparisonText.length} characters)</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-center">
        <Button 
          size="lg" 
          onClick={handleCompare}
          disabled={!originalText || !comparisonText}
          className="px-8"
        >
          Compare Texts
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;
