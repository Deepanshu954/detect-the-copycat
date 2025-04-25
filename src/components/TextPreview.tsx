
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface TextPreviewProps {
  title: string;
  text: string;
  highlightedSegments?: string[];
  className?: string;
}

const TextPreview: React.FC<TextPreviewProps> = ({
  title,
  text,
  highlightedSegments = [],
  className = "",
}) => {
  // Function to highlight matched segments in text
  const highlightText = (text: string) => {
    if (!highlightedSegments || highlightedSegments.length === 0) {
      return text;
    }

    let result = text;
    highlightedSegments.forEach((segment) => {
      // Case-insensitive replacement
      const regex = new RegExp(segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      result = result.replace(regex, match => `<mark class="bg-yellow-200 px-1 rounded">${match}</mark>`);
    });

    return <div dangerouslySetInnerHTML={{ __html: result }} />;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="prose max-w-none">
        <div className="whitespace-pre-wrap font-mono text-sm bg-slate-50 p-4 rounded-md border">
          {highlightText(text)}
        </div>
      </CardContent>
    </Card>
  );
};

export default TextPreview;
