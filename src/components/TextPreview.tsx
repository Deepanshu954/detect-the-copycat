
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TextPreviewProps {
  text: string;
  title: string;
  className?: string;
}

const TextPreview: React.FC<TextPreviewProps> = ({ text, title, className }) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm overflow-auto max-h-[300px] whitespace-pre-wrap">
        {text || <span className="text-muted-foreground italic">No text provided</span>}
      </CardContent>
    </Card>
  );
};

export default TextPreview;
