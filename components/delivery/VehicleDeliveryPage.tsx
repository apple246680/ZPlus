
import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Order, VehicleDelivery, OrderStatus }
from '../../types';
import { OrderSearchForm } from '../order/OrderSearchForm';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';

export const VehicleDeliveryPage: React.FC = () => {
  const [searchedOrder, setSearchedOrder] = useState<Order | undefined>(undefined);
  const [searchError, setSearchError] = useState<string>('');
  const { findOrder, updateOrderVehicleDelivery, currentUser, updateOrderStatus } = useAppContext();

  const [vin, setVin] = useState<string>('');
  const [manufactureDate, setManufactureDate] = useState<string>('');
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleSearch = (orderNumber: string) => {
    setSearchError('');
    const order = findOrder(orderNumber);
    if (order) {
      if (order.status !== OrderStatus.FinancialApproved && order.status !== OrderStatus.VehicleDeliveryInProgress) {
         setSearchedOrder(undefined);
         setSearchError(`Order ${orderNumber} is not ready for vehicle delivery (Status: ${order.status}). It must be Financially Approved.`);
         return;
      }
      setSearchedOrder(order);
      setVin(order.vehicleDelivery?.vin || '');
      setManufactureDate(order.vehicleDelivery?.manufactureDate || '');
      setDeliveryDate(order.vehicleDelivery?.deliveryDate ? new Date(order.vehicleDelivery.deliveryDate).toISOString().split('T')[0] : '');
      setNotes(order.vehicleDelivery?.notes || '');

      if (order.status === OrderStatus.FinancialApproved) {
        updateOrderStatus(orderNumber, OrderStatus.VehicleDeliveryInProgress, currentUser?.username || 'System', 'Vehicle delivery process started.');
      }

    } else {
      setSearchedOrder(undefined);
      setSearchError(`Order with number "${orderNumber}" not found.`);
    }
  };

  const handleSubmitDelivery = () => {
    if (!searchedOrder || !currentUser) return;
    if (!vin || !manufactureDate) {
        setModalMessage("VIN and Manufacture Date are required.");
        setIsModalOpen(true);
        return;
    }

    const deliveryDetails: VehicleDelivery = {
      vin,
      manufactureDate,
      deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined,
      notes,
    };

    const success = updateOrderVehicleDelivery(searchedOrder.orderNumber, deliveryDetails);
    if (success) {
      setModalMessage(`Vehicle details for order ${searchedOrder.orderNumber} updated successfully.`);
      setSearchedOrder(findOrder(searchedOrder.orderNumber)); // Refresh order
    } else {
      setModalMessage(`Failed to update vehicle details for order ${searchedOrder.orderNumber}.`);
    }
    setIsModalOpen(true);
  };
  
  const handleOrderFinished = () => {
    if (!searchedOrder || !currentUser || !searchedOrder.vehicleDelivery) return;
    updateOrderStatus(searchedOrder.orderNumber, OrderStatus.Finished, currentUser.username, "Order marked as finished by customer.");
    setModalMessage(`Order ${searchedOrder.orderNumber} has been marked as Finished.`);
    setIsModalOpen(true);
    setSearchedOrder(findOrder(searchedOrder.orderNumber)); // Refresh order
  };


  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Car (Vehicle) Delivery</h2>
      <OrderSearchForm onSearch={handleSearch} />
      {searchError && <p className="text-red-400 bg-red-900 bg-opacity-30 p-3 rounded-md">{searchError}</p>}

      {searchedOrder && (searchedOrder.status === OrderStatus.VehicleDeliveryInProgress || searchedOrder.status === OrderStatus.FinancialApproved) && (
        <div className="mt-6 p-6 bg-zyberion-light-blue rounded-lg shadow">
          <h3 className="text-xl font-semibold text-zyberion-teal mb-4">Import Car/Vehicle Data for Order: {searchedOrder.orderNumber}</h3>
          <div className="mb-4 p-3 bg-input-bg rounded">
            <p><strong>Account:</strong> {searchedOrder.accountName}</p>
            <p><strong>Car Model:</strong> {searchedOrder.carInfo.modelName}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input label="VIN (Vehicle Identification Number)" type="text" value={vin} onChange={e => setVin(e.target.value.toUpperCase())} placeholder="e.g., U0180152025055688" error={!vin ? 'VIN is required': ''} />
            <Input label="Manufacture Date" type="date" value={manufactureDate} onChange={e => setManufactureDate(e.target.value)} error={!manufactureDate ? 'Manufacture Date is required': ''} />
            <Input label="Actual Delivery Date (Optional)" type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} />
            <Input label="Notes (Optional)" type="text" value={notes} onChange={e => setNotes(e.target.value)} containerClassName="md:col-span-2" />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button onClick={handleSubmitDelivery} variant="primary">Save Vehicle Data</Button>
          </div>
        </div>
      )}
      {searchedOrder && searchedOrder.status === OrderStatus.Delivered && (
         <div className="mt-6 p-6 bg-zyberion-light-blue rounded-lg shadow">
            <h3 className="text-xl font-semibold text-zyberion-teal mb-4">Order Ready: {searchedOrder.orderNumber}</h3>
            <p className="text-zyberion-light-gray mb-2">Vehicle data has been associated. VIN: {searchedOrder.vehicleDelivery?.vin}</p>
            <p className="text-zyberion-light-gray mb-4">Is the customer taking final delivery?</p>
            <div className="flex justify-end">
                <Button onClick={handleOrderFinished} variant="primary">Mark Order as Finished</Button>
            </div>
         </div>
      )}
      {searchedOrder && searchedOrder.status === OrderStatus.Finished && (
         <div className="mt-6 p-6 bg-green-900 bg-opacity-50 rounded-lg shadow text-center">
            <p className="text-xl text-green-300 font-semibold">Order {searchedOrder.orderNumber} is Finished.</p>
            <p className="text-sm text-green-400">VIN: {searchedOrder.vehicleDelivery?.vin}, Delivered on: {searchedOrder.vehicleDelivery?.deliveryDate ? new Date(searchedOrder.vehicleDelivery.deliveryDate).toLocaleDateString() : 'N/A'}</p>
         </div>
      )}


      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Vehicle Delivery Status">
        <p>{modalMessage}</p>
        <div className="mt-4 flex justify-end">
            <Button onClick={() => setIsModalOpen(false)} variant="primary">OK</Button>
        </div>
      </Modal>
    </div>
  );
};
    