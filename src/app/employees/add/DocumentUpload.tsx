'use client';

import React from 'react';
import { UploadCloud } from 'lucide-react';

type Props = {
  docTitles: string[];
  uploadedDocs: (File | null)[];
  docInputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  handleDocUpload: (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  triggerDocInput: (index: number) => void;
};

export default function DocumentUpload({
  docTitles,
  uploadedDocs,
  docInputRefs,
  handleDocUpload,
  triggerDocInput
}: Props) {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {docTitles.map((title, index) => (
          <div
            key={index}
            className="border-2 border-dashed border-purple-300 rounded-md p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-purple-50 transition"
            onClick={() => triggerDocInput(index)}
          >
            <span className="text-sm font-medium text-gray-800 mb-3">{title}</span>
            <UploadCloud className="w-6 h-6 text-purple-600 mb-2" />
            {uploadedDocs[index] ? (
              <span className="text-sm text-gray-700 truncate max-w-[180px]">{uploadedDocs[index].name}</span>
            ) : (
              <>
                <p className="text-sm text-gray-500">
                  Drag & Drop or <span className="text-purple-600 underline">choose file</span> to upload
                </p>
              </>
            )}
            <p className="text-[10px] text-gray-400 mt-1">Supported formats: .jpeg, .pdf</p>
          </div>
        ))}
      </div>

      {/* Hidden file inputs */}
      {docTitles.map((_, index) => (
        <input
          key={`input-${index}`}
          type="file"
          accept=".jpg,.jpeg,.pdf"
          ref={(el) => { docInputRefs.current[index] = el; }}
          onChange={handleDocUpload(index)}
          className="hidden"
        />
      ))}

     
     
    </div>
  );
}
