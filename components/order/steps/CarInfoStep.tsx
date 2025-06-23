
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Select } from '../../ui/Select';
import { CarModel, EquipmentItem, OrderFormData, OrderCarInfo } from '../../../types';
import { MOCK_CAR_MODELS, MOCK_EQUIPMENT_ITEMS } from '../../../constants';

interface CarInfoStepProps {
  formData: OrderFormData;
  onUpdateFormData: (data: Partial<OrderFormData>) => void;
  onValidate: (isValid: boolean) => void;
}

export const CarInfoStep: React.FC<CarInfoStepProps> = ({ formData, onUpdateFormData, onValidate }) => {
  const [selectedModelId, setSelectedModelId] = useState<string>(formData.carInfo?.modelId || '');
  const [selectedEquipmentIds, setSelectedEquipmentIds] = useState<string[]>(formData.carInfo?.selectedEquipment.map(e => e.id) || []);
  const [loanRequired, setLoanRequired] = useState<boolean>(formData.loanRequired || false);
  const [errors, setErrors] = useState<{ model?: string; equipment?: string }>({});

  const selectedModel = useMemo(() => MOCK_CAR_MODELS.find(m => m.id === selectedModelId), [selectedModelId]);
  
  const availableEquipmentForModel = useMemo(() => {
    if (!selectedModel) return [];
    return MOCK_EQUIPMENT_ITEMS.filter(eq => selectedModel.availableEquipmentIds.includes(eq.id));
  }, [selectedModel]);

  const calculateTotalPrice = useCallback(() => {
    if (!selectedModel) return 0;
    const equipmentPrice = selectedEquipmentIds.reduce((sum, eqId) => {
      const equipment = MOCK_EQUIPMENT_ITEMS.find(e => e.id === eqId);
      return sum + (equipment?.price || 0);
    }, 0);
    return selectedModel.basePrice + equipmentPrice;
  }, [selectedModel, selectedEquipmentIds]);

  const totalCarPrice = useMemo(calculateTotalPrice, [calculateTotalPrice]);

  const validateStep = useCallback(() => {
    const newErrors: { model?: string; equipment?: string } = {};
    if (!selectedModelId) {
      newErrors.model = 'A car model must be selected.';
    }
    // Equipment selection is optional, but if a model is selected, it's good to proceed.
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    onValidate(isValid);
    return isValid;
  }, [selectedModelId, onValidate]);
  
  useEffect(() => {
    validateStep();
  }, [selectedModelId, validateStep]);

  useEffect(() => {
    if (selectedModel) {
      const currentCarInfo: OrderCarInfo = {
        modelId: selectedModel.id,
        modelName: selectedModel.name,
        basePrice: selectedModel.basePrice,
        selectedEquipment: selectedEquipmentIds
          .map(id => MOCK_EQUIPMENT_ITEMS.find(eq => eq.id === id))
          .filter((eq): eq is EquipmentItem => Boolean(eq)),
        totalPrice: totalCarPrice,
      };
      onUpdateFormData({ carInfo: currentCarInfo, selectedCarModel: selectedModel, loanRequired });
    } else {
       onUpdateFormData({ carInfo: undefined, selectedCarModel: undefined, loanRequired });
    }
  }, [selectedModel, selectedEquipmentIds, totalCarPrice, onUpdateFormData, loanRequired]);


  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const modelId = e.target.value;
    setSelectedModelId(modelId);
    setSelectedEquipmentIds([]); // Reset equipment when model changes
    setErrors(prev => ({...prev, model: undefined}));
  };

  const handleEquipmentToggle = (equipmentId: string) => {
    setSelectedEquipmentIds(prev =>
      prev.includes(equipmentId) ? prev.filter(id => id !== equipmentId) : [...prev, equipmentId]
    );
  };
  
  const handleLoanRequiredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoanRequired(e.target.checked);
    onUpdateFormData({ loanRequired: e.target.checked });
  };


  return (
    <div className="space-y-6 p-2">
      <h3 className="text-xl font-semibold text-zyberion-light-gray mb-4">Select Car Model</h3>
      <Select
        label="Car Model"
        value={selectedModelId}
        onChange={handleModelChange}
        error={errors.model}
      >
        <option value="">-- Select a Car Model --</option>
        {MOCK_CAR_MODELS.map((model: CarModel) => (
          <option key={model.id} value={model.id}>{model.name} (Base: ${model.basePrice.toLocaleString()})</option>
        ))}
      </Select>

      {selectedModel && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
                {selectedModel.imageUrl && <img src={selectedModel.imageUrl} alt={selectedModel.name} className="rounded-lg shadow-lg mb-4 w-full h-auto object-cover" />}
                <h4 className="text-lg font-semibold text-zyberion-teal mb-2">Available Equipment for {selectedModel.name}</h4>
                {availableEquipmentForModel.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto p-2 border border-zyberion-dark-gray rounded-md">
                    {availableEquipmentForModel.map((eq: EquipmentItem) => (
                    <label key={eq.id} className="flex items-center space-x-2 p-2 bg-input-bg rounded hover:bg-zyberion-dark-gray cursor-pointer">
                        <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-zyberion-teal bg-gray-700 border-gray-600 rounded focus:ring-zyberion-teal focus:ring-offset-zyberion-blue"
                        checked={selectedEquipmentIds.includes(eq.id)}
                        onChange={() => handleEquipmentToggle(eq.id)}
                        />
                        <span>{eq.name} (+${eq.price.toLocaleString()})</span>
                    </label>
                    ))}
                </div>
                ) : <p className="text-zyberion-gray">No specific equipment listed for this model.</p>}
            </div>
            <div className="p-4 bg-zyberion-light-blue rounded-md border border-zyberion-dark-gray">
                <h4 className="text-lg font-semibold text-zyberion-teal mb-2">Cost Summary</h4>
                <p>Base Model Price: <span className="font-mono float-right">${selectedModel.basePrice.toLocaleString()}</span></p>
                <p>Selected Equipment: <span className="font-mono float-right">${(totalCarPrice - selectedModel.basePrice).toLocaleString()}</span></p>
                <hr className="my-2 border-zyberion-dark-gray" />
                <p className="text-xl font-bold">Total Car Price: <span className="font-mono float-right">${totalCarPrice.toLocaleString()}</span></p>
            
                <div className="mt-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-zyberion-teal bg-gray-700 border-gray-600 rounded focus:ring-zyberion-teal focus:ring-offset-zyberion-blue"
                        checked={loanRequired}
                        onChange={handleLoanRequiredChange}
                    />
                    <span className="text-zyberion-light-gray">Loan Plan Required?</span>
                    </label>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
    