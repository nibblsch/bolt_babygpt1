import React from 'react';
import { AlertCircle } from 'lucide-react';

export function MedicalDisclaimer() {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-8">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-blue-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-blue-700">
            Important: Using BabyGPT does not create a patient-physician relationship. For medical advice, please consult with your pediatrician.
          </p>
        </div>
      </div>
    </div>
  );
}