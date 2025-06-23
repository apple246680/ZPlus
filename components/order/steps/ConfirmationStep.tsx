
import React, { useEffect } from 'react';
import { OrderFormData } from '../../../types';

interface ConfirmationStepProps {
  formData: OrderFormData;
  onValidate: (isValid: boolean) => void;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ formData, onValidate }) => {
  // This step is always valid if reached, as data is gathered from previous steps.
  // Validation would have happened in prior steps.
  useEffect(() => {
    onValidate(true);
  }, [onValidate]);

  const { foundUser, storeName, carInfo, loanRequired, loanInfo } = formData;

  const totalOrderAmount = carInfo?.totalPrice || 0;

  return (
    <div className="space-y-6 p-2 text-zyberion-light-gray">
      <h3 className="text-2xl font-semibold text-zyberion-teal mb-6 border-b border-zyberion-dark-gray pb-2">Order Summary</h3>

      {/* Account Information */}
      <div className="bg-zyberion-light-blue p-4 rounded-lg shadow">
        <h4 className="text-lg font-semibold text-zyberion-teal mb-2">Account & Store</h4>
        {foundUser ? (
          <>
            <p><strong>Account Name:</strong> {foundUser.name}</p>
            <p><strong>Email:</strong> {foundUser.email}</p>
            <p><strong>Phone:</strong> {foundUser.phone}</p>
          </>
        ) : <p className="text-red-400">Account information missing.</p>}
        {storeName ? (
            <p><strong>Store:</strong> {storeName}</p>
        ) : <p className="text-red-400">Store information missing.</p>}
      </div>

      {/* Car Information */}
      <div className="bg-zyberion-light-blue p-4 rounded-lg shadow">
        <h4 className="text-lg font-semibold text-zyberion-teal mb-2">Vehicle Details</h4>
        {carInfo && formData.selectedCarModel ? (
          <>
            <p><strong>Model:</strong> {formData.selectedCarModel.name}</p>
            <p><strong>Base Price:</strong> ${formData.selectedCarModel.basePrice.toLocaleString()}</p>
            {carInfo.selectedEquipment.length > 0 && (
              <div>
                <strong>Equipment:</strong>
                <ul className="list-disc list-inside ml-4">
                  {carInfo.selectedEquipment.map(eq => (
                    <li key={eq.id}>{eq.name} (+${eq.price.toLocaleString()})</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="mt-2"><strong>Total Vehicle Price:</strong> <span className="font-bold text-xl">${carInfo.totalPrice.toLocaleString()}</span></p>
          </>
        ) : <p className="text-red-400">Car information missing.</p>}
      </div>

      {/* Loan Information */}
      {loanRequired && (
        <div className="bg-zyberion-light-blue p-4 rounded-lg shadow">
          <h4 className="text-lg font-semibold text-zyberion-teal mb-2">Loan Details</h4>
          {loanInfo && formData.selectedBank && formData.selectedLoanPlan ? (
            <>
              <p><strong>Bank:</strong> {formData.selectedBank.name}</p>
              <p><strong>Plan:</strong> {formData.selectedLoanPlan.name}</p>
              <p><strong>Interest Rate:</strong> {formData.selectedLoanPlan.interestRate}%</p>
              <p><strong>Term:</strong> {formData.selectedLoanPlan.termYears} years</p>
              <p><strong>Requested Loan Amount:</strong> ${loanInfo.requestedAmount.toLocaleString()}</p>
            </>
          ) : <p className="text-red-400">Loan information incomplete or missing.</p>}
        </div>
      )}
      {!loanRequired && (
        <div className="bg-zyberion-light-blue p-4 rounded-lg shadow">
            <h4 className="text-lg font-semibold text-zyberion-teal mb-2">Loan Details</h4>
            <p>No loan required for this order.</p>
        </div>
      )}
      
      <div className="mt-6 pt-4 border-t border-zyberion-dark-gray">
          <p className="text-2xl font-bold text-right">
              Total Order Amount: <span className="text-zyberion-teal">${totalOrderAmount.toLocaleString()}</span>
          </p>
      </div>
    </div>
  );
};
    