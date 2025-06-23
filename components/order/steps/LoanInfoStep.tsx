
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Select } from '../../ui/Select';
import { Input } from '../../ui/Input';
import { Bank, LoanPlanDetails, OrderFormData, OrderLoanInfo } from '../../../types';
import { MOCK_BANKS } from '../../../constants';

interface LoanInfoStepProps {
  formData: OrderFormData;
  onUpdateFormData: (data: Partial<OrderFormData>) => void;
  onValidate: (isValid: boolean) => void;
}

export const LoanInfoStep: React.FC<LoanInfoStepProps> = ({ formData, onUpdateFormData, onValidate }) => {
  const [selectedBankId, setSelectedBankId] = useState<string>(formData.loanInfo?.bankId || '');
  const [selectedPlanId, setSelectedPlanId] = useState<string>(formData.loanInfo?.planId || '');
  const [requestedAmount, setRequestedAmount] = useState<number>(formData.loanInfo?.requestedAmount || formData.carInfo?.totalPrice || 0);
  const [errors, setErrors] = useState<{ bank?: string; plan?: string; amount?: string }>({});

  const selectedBank = useMemo(() => MOCK_BANKS.find(b => b.id === selectedBankId), [selectedBankId]);
  const selectedPlan = useMemo(() => selectedBank?.loanPlans.find(p => p.id === selectedPlanId), [selectedBank, selectedPlanId]);

  const validateStep = useCallback(() => {
    const newErrors: { bank?: string; plan?: string; amount?: string } = {};
    if (!selectedBankId) newErrors.bank = 'A bank must be selected.';
    if (!selectedPlanId) newErrors.plan = 'A loan plan must be selected.';
    if (requestedAmount <= 0) newErrors.amount = 'Requested loan amount must be positive.';
    else if (formData.carInfo && requestedAmount > formData.carInfo.totalPrice) {
        newErrors.amount = `Loan amount cannot exceed total car price ($${formData.carInfo.totalPrice.toLocaleString()}).`;
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    onValidate(isValid);
    return isValid;
  }, [selectedBankId, selectedPlanId, requestedAmount, onValidate, formData.carInfo]);

  useEffect(() => {
    validateStep();
  }, [selectedBankId, selectedPlanId, requestedAmount, validateStep]);


  useEffect(() => {
    if (selectedBank && selectedPlan) {
      const currentLoanInfo: OrderLoanInfo = {
        bankId: selectedBank.id,
        bankName: selectedBank.name,
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        interestRate: selectedPlan.interestRate,
        termYears: selectedPlan.termYears,
        requestedAmount: requestedAmount,
      };
      onUpdateFormData({ loanInfo: currentLoanInfo, selectedBank, selectedLoanPlan: selectedPlan });
    } else {
      onUpdateFormData({ loanInfo: undefined, selectedBank: undefined, selectedLoanPlan: undefined });
    }
  }, [selectedBank, selectedPlan, requestedAmount, onUpdateFormData]);

  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBankId(e.target.value);
    setSelectedPlanId(''); // Reset plan when bank changes
    setErrors(prev => ({...prev, bank: undefined, plan: undefined}));
  };

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlanId(e.target.value);
    setErrors(prev => ({...prev, plan: undefined}));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value);
    setRequestedAmount(isNaN(amount) ? 0 : amount);
  };

  if (!formData.loanRequired) {
    onValidate(true); // This step is valid if loan is not required
    return <div className="p-4 text-center text-zyberion-gray">Loan not required for this order. This step is skipped.</div>;
  }

  return (
    <div className="space-y-6 p-2">
      <h3 className="text-xl font-semibold text-zyberion-light-gray mb-4">Loan Information</h3>
      
      <Select label="Select Bank" value={selectedBankId} onChange={handleBankChange} error={errors.bank}>
        <option value="">-- Choose a Bank --</option>
        {MOCK_BANKS.map((bank: Bank) => (
          <option key={bank.id} value={bank.id}>{bank.name}</option>
        ))}
      </Select>

      {selectedBank && (
        <div className="p-3 bg-input-bg rounded">
            <p className="text-sm text-zyberion-gray">
                Interest Rate Range: {selectedBank.minInterest}% - {selectedBank.maxInterest}%
            </p>
            <p className="text-sm text-zyberion-gray">
                Loan Term Range: {selectedBank.minTerm} - {selectedBank.maxTerm} years
            </p>
        </div>
      )}

      {selectedBank && (
        <Select label="Select Loan Plan" value={selectedPlanId} onChange={handlePlanChange} error={errors.plan} disabled={!selectedBankId}>
          <option value="">-- Choose a Loan Plan --</option>
          {selectedBank.loanPlans.map((plan: LoanPlanDetails) => (
            <option key={plan.id} value={plan.id}>
              {plan.name} ({plan.interestRate}% for {plan.termYears} years)
            </option>
          ))}
        </Select>
      )}

      {selectedPlan && (
         <div className="p-3 bg-input-bg rounded">
            <p className="text-sm text-zyberion-teal">Selected Plan: {selectedPlan.name}</p>
            <p className="text-sm text-zyberion-gray">Interest Rate: {selectedPlan.interestRate}%</p>
            <p className="text-sm text-zyberion-gray">Term: {selectedPlan.termYears} years</p>
        </div>
      )}
      
      <Input 
        label="Requested Loan Amount"
        type="number"
        value={requestedAmount}
        onChange={handleAmountChange}
        error={errors.amount}
        min="0"
        max={formData.carInfo?.totalPrice?.toString()}
        disabled={!selectedPlanId}
        placeholder={`Max ${formData.carInfo?.totalPrice?.toLocaleString()}`}
       />
       {formData.carInfo && <p className="text-xs text-zyberion-gray -mt-3">Total car price: ${formData.carInfo.totalPrice.toLocaleString()}</p>}
    </div>
  );
};
    