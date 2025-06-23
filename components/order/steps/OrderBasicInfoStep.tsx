
import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { Button } from '../../ui/Button';
import { User, Store, OrderFormData } from '../../../types';
import { MOCK_USERS, MOCK_STORES } from '../../../constants';

interface OrderBasicInfoStepProps {
  formData: OrderFormData;
  onUpdateFormData: (data: Partial<OrderFormData>) => void;
  onValidate: (isValid: boolean) => void;
}

export const OrderBasicInfoStep: React.FC<OrderBasicInfoStepProps> = ({ formData, onUpdateFormData, onValidate }) => {
  const [searchTerm, setSearchTerm] = useState(formData.searchUserTerm || '');
  const [searchType, setSearchType] = useState<'email' | 'phone'>('email');
  const [foundUser, setFoundUser] = useState<User | undefined>(formData.foundUser);
  const [selectedStoreId, setSelectedStoreId] = useState<string>(formData.storeId || '');
  const [errors, setErrors] = useState<{ user?: string; store?: string }>({});

  const validateStep = useCallback(() => {
    const newErrors: { user?: string; store?: string } = {};
    if (!foundUser) {
      newErrors.user = 'An account must be selected.';
    }
    if (!selectedStoreId) {
      newErrors.store = 'A store must be selected.';
    }
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    onValidate(isValid);
    return isValid;
  }, [foundUser, selectedStoreId, onValidate]);

  useEffect(() => {
    // Initial validation and persist changes if any
    validateStep();
  }, [foundUser, selectedStoreId, validateStep]);


  const handleSearch = () => {
    if (!searchTerm.trim()) {
        setErrors(prev => ({...prev, user: 'Search term cannot be empty.'}));
        setFoundUser(undefined);
        onUpdateFormData({ foundUser: undefined });
        return;
    }
    const user = MOCK_USERS.find(u => 
      searchType === 'email' ? u.email.toLowerCase() === searchTerm.toLowerCase() : u.phone === searchTerm
    );
    if (user) {
      setFoundUser(user);
      onUpdateFormData({ foundUser: user, accountId: user.id, accountName: user.name, accountEmail: user.email, searchUserTerm: searchTerm });
      setErrors(prev => ({...prev, user: undefined}));
    } else {
      setFoundUser(undefined);
      onUpdateFormData({ foundUser: undefined });
      setErrors(prev => ({...prev, user: 'Account not found.'}));
    }
  };
  
  const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const storeId = e.target.value;
    setSelectedStoreId(storeId);
    const store = MOCK_STORES.find(s => s.id === storeId);
    if (store) {
        onUpdateFormData({ storeId: store.id, storeName: store.name });
        setErrors(prev => ({...prev, store: undefined}));
    } else {
        onUpdateFormData({ storeId: undefined, storeName: undefined });
    }
  };

  return (
    <div className="space-y-6 p-2">
      <h3 className="text-xl font-semibold text-zyberion-light-gray mb-4">Account Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <Select
            label="Search by"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as 'email' | 'phone')}
            containerClassName="md:col-span-1"
        >
            <option value="email">Email</option>
            <option value="phone">Phone</option>
        </Select>
        <Input
            label={searchType === 'email' ? 'Account Email' : 'Account Phone'}
            type={searchType === 'email' ? 'email' : 'tel'}
            placeholder={searchType === 'email' ? 'e.g., user@example.com' : 'e.g., 123-456-7890'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            containerClassName="md:col-span-1"
        />
        <Button onClick={handleSearch} variant="secondary" className="h-10 self-end mb-4">Search Account</Button>
      </div>
      {errors.user && <p className="text-red-400 text-sm">{errors.user}</p>}

      {foundUser && (
        <div className="mt-4 p-4 bg-zyberion-light-blue rounded-md border border-zyberion-dark-gray">
          <h4 className="font-semibold text-lg text-zyberion-teal">Account Details:</h4>
          <p><strong>Name:</strong> {foundUser.name}</p>
          <p><strong>Email:</strong> {foundUser.email}</p>
          <p><strong>Phone:</strong> {foundUser.phone}</p>
        </div>
      )}

      <h3 className="text-xl font-semibold text-zyberion-light-gray mt-6 mb-4">Store Information</h3>
      <Select
        label="Choose Store"
        value={selectedStoreId}
        onChange={handleStoreChange}
        error={errors.store}
      >
        <option value="">Select a store</option>
        {MOCK_STORES.map((store: Store) => (
          <option key={store.id} value={store.id}>{store.name}</option>
        ))}
      </Select>
    </div>
  );
};
    