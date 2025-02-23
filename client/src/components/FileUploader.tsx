import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Paperclip } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface FileUploaderProps {
  onUpload: (files: File[]) => void;
}

export function FileUploader({ onUpload }: FileUploaderProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle accepted files
    if (acceptedFiles.length > 0) {
      const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
      onUpload(acceptedFiles);
      
      toast({
        title: "Success",
        variant: "success",
        description: `${acceptedFiles.length} file${acceptedFiles.length > 1 ? 's' : ''} uploaded successfully`,
      });

      return () => {
        newPreviews.forEach(URL.revokeObjectURL);
      };
    }

    // Handle rejected files
    if (rejectedFiles.length > 0) {
      toast({
        title: "Error",
        description: "Only image files are allowed (jpg, png, gif, webp)",
        variant: "destructive",
      });
    }
  }, [onUpload, toast]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 4,
    onDropRejected: (rejectedFiles) => {
      if (rejectedFiles.some(file => file.errors[0]?.code === 'too-many-files')) {
        toast({
          title: "Error",
          description: "Maximum 4 files allowed",
          variant: "destructive",
        });
      }
    }
  });

  return (
    <div className="space-y-4">
      <div {...getRootProps()} className="inline-block">
        <input {...getInputProps()} />
        <button
          type="button"
          aria-label="Attach files"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <Paperclip className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
}