
import React from 'react';
import { FormStep } from '../../types';

interface StepIndicatorProps {
  currentStep: FormStep;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="rounded-xl bg-white dark:bg-[#1a202c] p-6 shadow-sm border border-[#f0f2f4] dark:border-[#2d3748]">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between text-sm font-medium">
          <span className={currentStep >= FormStep.BASIC_DETAILS ? 'text-primary' : 'text-[#616f89] dark:text-[#9ca3af]'}>
            Step 1: Basic Details
          </span>
          <span className={currentStep >= FormStep.VENUE_LOGISTICS ? 'text-primary' : 'text-[#616f89] dark:text-[#9ca3af]'}>
            Step 2: Venue & Logistics
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-[#dbdfe6] dark:bg-[#2d3748]">
          <div 
            className="h-full rounded-full bg-primary shadow-[0_0_10px_rgba(19,91,236,0.5)] transition-all duration-500" 
            style={{ width: currentStep === FormStep.BASIC_DETAILS ? '50%' : '100%' }}
          />
        </div>
      </div>
    </div>
  );
};
