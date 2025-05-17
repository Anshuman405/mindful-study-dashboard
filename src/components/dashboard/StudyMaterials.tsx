
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileImage, File, Upload, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';

const StudyMaterials = () => {
  const materials = [
    { id: 1, name: 'Biology_Chapter5_Notes.pdf', type: 'pdf', size: '2.4 MB', lastModified: '2 days ago' },
    { id: 2, name: 'Chemistry_Formula_Sheet.jpg', type: 'image', size: '1.1 MB', lastModified: '5 days ago' },
    { id: 3, name: 'History_Essay_Draft.docx', type: 'doc', size: '890 KB', lastModified: 'Yesterday' },
    { id: 4, name: 'Physics_Diagram.png', type: 'image', size: '1.7 MB', lastModified: 'Just now' },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-4 w-4" />;
      case 'pdf': return <File className="h-4 w-4" />;
      default: return <File className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <FileImage className="h-5 w-5 mr-2" />
            <span>Study Materials</span>
          </div>
          <Button variant="outline" size="sm" className="gap-1">
            <Upload className="h-4 w-4" />
            <span>Upload</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {materials.map((material) => (
            <div
              key={material.id}
              className="p-3 border border-neutral-100 rounded-lg flex items-center justify-between hover:bg-studyflow-blue/5 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-studyflow-blue/20 flex items-center justify-center mr-3">
                  {getFileIcon(material.type)}
                </div>
                <div>
                  <h4 className="font-medium text-sm">{material.name}</h4>
                  <p className="text-xs text-muted-foreground">{material.size} • {material.lastModified}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <File className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyMaterials;
