import React, { useState, Children } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Step = ({ children }) => <div>{children}</div>;

export default function Stepper({
    children,
    initialStep = 1,
    onFinalStepCompleted,
    nextButtonText = "Continue",
    backButtonText = "Back",
    isStepValid // New prop for validation logic
}) {
    const [currentStep, setCurrentStep] = useState(initialStep);
    const steps = Children.toArray(children);
    const totalSteps = steps.length;
    const isLastStep = currentStep === totalSteps;

    // Check if user can move forward
    const canContinue = isStepValid?.(currentStep) ?? true;

    const handleNext = () => {
        if (!canContinue) return; // Strict block

        if (isLastStep) {
            onFinalStepCompleted();
        } else {
            setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
        }
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    return (
        <div className="flex flex-col h-full font-sans">
            {/* Progress Indicators */}
            <div className="flex justify-between mb-8">
                {steps.map((_, index) => (
                    <div key={index} className="flex items-center flex-1 last:flex-none">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] transition-colors ${currentStep >= index + 1
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-white/5 text-gray-500'
                            }`}>
                            {index + 1}
                        </div>
                        {index < totalSteps - 1 && (
                            <div className={`h-[1px] flex-1 mx-2 ${currentStep > index + 1 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-white/5'
                                }`} />
                        )}
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <div className="flex-1">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                    >
                        {steps[currentStep - 1]}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-8">
                {currentStep > 1 && (
                    <button
                        type="button"
                        onClick={handleBack}
                        className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 text-sm font-medium hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                    >
                        {backButtonText}
                    </button>
                )}
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={!canContinue}
                    className={`flex-[2] py-3 rounded-xl text-sm font-medium transition-all ${canContinue
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                        : 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    {isLastStep ? "Complete" : nextButtonText}
                </button>
            </div>
        </div>
    );
}