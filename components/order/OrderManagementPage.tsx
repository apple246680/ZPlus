
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { Order } from '../../types';
import { OrderSearchForm } from './OrderSearchForm';
import { OrderDetailsView } from './OrderDetailsView';

export const OrderManagementPage: React.FC = () => {
  const [searchedOrder, setSearchedOrder] = useState<Order | undefined>(undefined);
  const [searchError, setSearchError] = useState<string>('');
  const { findOrder } = useAppContext();
  const location = useLocation();

  // Parse orderNumber from query params on initial load
  const [initialOrderNumQuery, setInitialOrderNumQuery] = useState<string | undefined>(undefined);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderNumberFromQuery = params.get('orderNumber');
    if (orderNumberFromQuery && !initialOrderNumQuery) { // Process only once
      setInitialOrderNumQuery(orderNumberFromQuery);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);


  const handleSearch = (orderNumber: string) => {
    setSearchError('');
    const order = findOrder(orderNumber);
    if (order) {
      setSearchedOrder(order);
    } else {
      setSearchedOrder(undefined);
      setSearchError(`Order with number "${orderNumber}" not found.`);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Order Management</h2>
      <OrderSearchForm onSearch={handleSearch} initialOrderNumber={initialOrderNumQuery} />
      
      {searchError && <p className="text-red-400 bg-red-900 bg-opacity-30 p-3 rounded-md">{searchError}</p>}
      
      {searchedOrder ? (
        <OrderDetailsView order={searchedOrder} />
      ) : (
        !searchError && !initialOrderNumQuery && ( // Show prompt if no search, no error, and no initial query
            <div className="mt-8 text-center text-zyberion-gray p-6 bg-zyberion-light-blue rounded-lg">
                <p className="text-lg">Please enter an order number to view details.</p>
                <p className="text-sm">Format: XXX-XXXX-XXXX-XXXXX</p>
            </div>
        )
      )}
    </div>
  );
};
    