
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { OrderFormData, OrderCreationData, User, Store, CarModel, Bank, LoanPlanDetails } from '../../types';
import { WIZARD_STEPS } from '../../constants';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

import { OrderBasicInfoStep } from './steps/OrderBasicInfoStep';
import { CarInfoStep } from './steps/CarInfoStep';
import { LoanInfoStep } from './steps/LoanInfoStep';
import { ConfirmationStep } from './steps/ConfirmationStep';

export const CreateOrderWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OrderFormData>({
    loanRequired: false, // Default to no loan
    // Initialize other fields if necessary
  });
  const [isStepValid, setIsStepValid] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newlyCreatedOrderNumber, setNewlyCreatedOrderNumber] = useState<string | null>(null);

  const { addOrder, currentUser } = useAppContext();
  const navigate = useNavigate();

  const handleUpdateFormData = useCallback((data: Partial<OrderFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  const handleValidateStep = useCallback((isValid: boolean) => {
    setIsStepValid(isValid);
  }, []);

  const nextStep = () => {
    if (!isStepValid) {
        alert("Please complete all required fields correctly before proceeding.");
        return;
    }
    
    // Skip loan step if not required
    if (currentStep === 1 && !formData.loanRequired) { // currentStep 1 is CarInfo
      setCurrentStep(prev => Math.min(prev + 2, WIZARD_STEPS.length - 1));
    } else {
      setCurrentStep(prev => Math.min(prev + 1, WIZARD_STEPS.length - 1));
    }
    setIsStepValid(false); // Reset for next step
  };

  const prevStep = () => {
     // If skipping back over loan step
    if (currentStep === 3 && !formData.loanRequired) { // currentStep 3 is Confirmation
        setCurrentStep(prev => Math.max(prev - 2, 0));
    } else {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    }
    setIsStepValid(true); // Assume previous step was valid
  };

  const handleSubmitOrder = async () => {
    if (!isStepValid) {
        alert("Please ensure all information is correct.");
        return;
    }
    if (!formData.accountId || !formData.accountName || !formData.accountEmail || !formData.storeId || !formData.storeName || !formData.carInfo) {
        alert("Critical information missing. Please review all steps.");
        return;
    }

    const orderCreationData: OrderCreationData = {
        accountId: formData.accountId,
        accountName: formData.accountName,
        accountEmail: formData.accountEmail,
        storeId: formData.storeId,
        storeName: formData.storeName,
        carInfo: formData.carInfo,
        loanRequired: formData.loanRequired || false,
        loanInfo: formData.loanRequired ? formData.loanInfo : undefined,
        totalOrderAmount: formData.carInfo.totalPrice,
    };
    
    try {
        const newOrder = addOrder(orderCreationData);
        setNewlyCreatedOrderNumber(newOrder.orderNumber);
        setIsModalOpen(true);
    } catch (error) {
        console.error("Failed to create order:", error);
        alert(`Failed to create order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (newlyCreatedOrderNumber) {
        navigate(`/order-management?orderNumber=${newlyCreatedOrderNumber}`);
    } else {
        navigate('/order-management');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <OrderBasicInfoStep formData={formData} onUpdateFormData={handleUpdateFormData} onValidate={handleValidateStep} />;
      case 1:
        return <CarInfoStep formData={formData} onUpdateFormData={handleUpdateFormData} onValidate={handleValidateStep} />;
      case 2:
        return <LoanInfoStep formData={formData} onUpdateFormData={handleUpdateFormData} onValidate={handleValidateStep} />;
      case 3:
        return <ConfirmationStep formData={formData} onValidate={handleValidateStep} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-zyberion-light-blue p-6 rounded-lg shadow-xl min-h-[calc(100vh-200px)] flex flex-col">
      {/* Wizard Tabs */}
      <div className="mb-8 flex border-b border-zyberion-dark-gray">
        {WIZARD_STEPS.map((step, index) => {
          // Determine if step should be displayed (e.g., Loan step based on loanRequired)
          if (step.id === 'loan' && !formData.loanRequired && currentStep !== index) { // Also show if current step
            return null; 
          }
          return (
            <button
              key={step.id}
              onClick={() => {
                // Allow navigation to visited/valid previous steps
                if (index < currentStep) setCurrentStep(index);
                // For loan step, ensure it's applicable
                if (index === 2 && !formData.loanRequired) return;
                // Only allow click if it's a previous step or current
                if (index <= currentStep) setCurrentStep(index);

              }}
              disabled={index > currentStep && (index-currentStep > 1 && !(index === 2 && currentStep === 0 && !formData.loanRequired) ) } // disable future steps not immediately next unless skipping loan
              className={`py-3 px-4 font-medium text-sm focus:outline-none transition-colors duration-150
                ${currentStep === index
                  ? 'border-b-2 border-zyberion-teal text-zyberion-teal'
                  : 'text-zyberion-gray hover:text-zyberion-light-gray'
                }
                ${(step.id === 'loan' && !formData.loanRequired) ? 'hidden md:inline-block text-gray-500 line-through' : ''}
              `}
            >
              {step.name}
            </button>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="flex-grow">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 pt-6 border-t border-zyberion-dark-gray flex justify-end space-x-3">
        {currentStep > 0 && (
          <Button onClick={prevStep} variant="secondary">
            Previous
          </Button>
        )}
        {currentStep < WIZARD_STEPS.length - 1 ? (
          <Button onClick={nextStep} variant="primary" disabled={!isStepValid}>
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmitOrder} variant="primary" isLoading={false} disabled={!isStepValid}>
            Save Order
          </Button>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleModalClose} title="Order Created Successfully!">
        <p>Your order <span className="font-bold text-zyberion-teal">{newlyCreatedOrderNumber}</span> has been created.</p>
        <p>You will now be redirected to Order Management.</p>
        <div className="mt-4 flex justify-end">
            <Button onClick={handleModalClose} variant="primary">OK</Button>
        </div>
      </Modal>
    </div>
  );
};
    