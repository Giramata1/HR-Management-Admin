'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Define a reusable Document type
export type Document = {
  title: string; // The type of document, e.g., "Appointment Letter"
  file: {
    name: string;
    dataUrl: string; // The file's content as a Base64 data URL
  } | null;
};

// Define the type for the component's props
type Props = {
  docTitles: string[];
  onUploadComplete?: (uploadedDoc: Document) => void; 
  onUploadError?: (error: string) => void;
};

export default function DocumentUpload({
  docTitles,
  onUploadComplete,
  onUploadError
}: Props) {
  const { t } = useTranslation();

  const [uploadedFiles, setUploadedFiles] = useState<(File | null)[]>(
    Array(docTitles.length).fill(null)
  );
  const docInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isUploading, setIsUploading] = useState<boolean[]>(Array(docTitles.length).fill(false));
  const [uploadErrors, setUploadErrors] = useState<string[]>(Array(docTitles.length).fill(''));

  const triggerDocInput = (index: number) => {
    docInputRefs.current[index]?.click();
  };

  const handleDocUpload = (index: number) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        const newErrors = [...uploadErrors];
        newErrors[index] = t('documentUpload.invalidFormat', { defaultValue: 'Invalid file format.' });
        setUploadErrors(newErrors);
        return;
      }

      const newUploadedFiles = [...uploadedFiles];
      newUploadedFiles[index] = file;
      setUploadedFiles(newUploadedFiles);

      const newErrors = [...uploadErrors];
      newErrors[index] = '';
      setUploadErrors(newErrors);

      const newIsUploading = [...isUploading];
      newIsUploading[index] = true;
      setIsUploading(newIsUploading);

      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const dataUrl = reader.result as string;

          // Simulate API call delay
          setTimeout(() => {
            console.log(`Simulated upload success for: ${file.name}`);
            if (onUploadComplete) {
              const documentToSave: Document = {
                title: docTitles[index],
                file: {
                  name: file.name,
                  dataUrl: dataUrl,
                }
              };
              onUploadComplete(documentToSave);
            }
            
            const finalIsUploading = [...isUploading];
            finalIsUploading[index] = false;
            setIsUploading(finalIsUploading);
          }, 1500);
        };

        // FIX: The 'error' variable is now used in console.error, removing the warning.
        reader.onerror = (error) => {
            console.error("FileReader error:", error); // Log the actual error
            throw new Error("Could not read the file.");
        };

      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        const newErrors = [...uploadErrors];
        newErrors[index] = t('documentUpload.uploadFailed', { defaultValue: 'Upload failed.' });
        setUploadErrors(newErrors);
        if (onUploadError) {
          onUploadError(`Failed to upload ${file.name}`);
        }
        const finalIsUploading = [...isUploading];
        finalIsUploading[index] = false;
        setIsUploading(finalIsUploading);
      } finally {
        if (e.target) {
            e.target.value = '';
        }
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">Documents</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {docTitles.map((title, index) => (
          <div
            key={index}
            className={`border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center text-center cursor-pointer transition ${
              isUploading[index] ? 'border-blue-500 animate-pulse' : uploadErrors[index] ? 'border-red-500' : 'border-purple-300 hover:bg-purple-50'
            }`}
            onClick={() => !isUploading[index] && triggerDocInput(index)}
          >
            <span className="text-sm font-medium text-gray-800 mb-3">{title}</span>
            <UploadCloud className={`w-6 h-6 mb-2 ${isUploading[index] ? 'text-blue-600' : uploadErrors[index] ? 'text-red-600' : 'text-purple-600'}`} />
            {uploadedFiles[index] ? (
              <>
                <span className="text-sm text-gray-700 truncate max-w-[180px]">{uploadedFiles[index]?.name}</span>
                {isUploading[index] && <span className="text-xs text-blue-500 mt-1">{t('documentUpload.uploading', { defaultValue: 'Uploading...' })}</span>}
                {uploadErrors[index] && <span className="text-xs text-red-500 mt-1">{uploadErrors[index]}</span>}
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500">
                  <span className="text-purple-600 underline">{t('documentUpload.chooseFile', { defaultValue: 'Choose file' })}</span> {t('documentUpload.toUpload', { defaultValue: 'to upload' })}
                </p>
                {uploadErrors[index] && <span className="text-xs text-red-500 mt-1">{uploadErrors[index]}</span>}
              </>
            )}
            <p className="text-[10px] text-gray-400 mt-1">{t('documentUpload.supportedFormats', { defaultValue: 'PDF, JPG, PNG' })}</p>
          </div>
        ))}
      </div>
      {docTitles.map((_, index) => (
        <input
          key={`input-${index}`}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          ref={(el) => { docInputRefs.current[index] = el; }}
          onChange={handleDocUpload(index)}
          className="hidden"
        />
      ))}
    </div>
  );
}