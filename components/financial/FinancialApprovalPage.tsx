
import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Order, FinancialApproval, OrderStatus } from '../../types';
import { OrderSearchForm } from '../order/OrderSearchForm';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';

export const FinancialApprovalPage: React.FC = () => {
  const [searchedOrder, setSearchedOrder] = useState<Order | undefined>(undefined);
  const [searchError, setSearchError] = useState<string>('');
  const { findOrder, updateOrderFinancialApproval, currentUser, updateOrderStatus } = useAppContext();

  const [approvedAmount, setApprovedAmount] = useState<number>(0);
  const [approvedInterest, setApprovedInterest] = useState<number>(0);
  const [approvedDuration, setApprovedDuration] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleSearch = (orderNumber: string) => {
    setSearchError('');
    const order = findOrder(orderNumber);
    if (order) {
      if (!order.loanRequired) {
        setSearchedOrder(undefined);
        setSearchError(`Order ${orderNumber} does not require a loan.`);
        return;
      }
      if (order.status !== OrderStatus.Created && order.status !== OrderStatus.FinancialApprovalInProgress) {
        setSearchedOrder(undefined);
        setSearchError(`Order ${orderNumber} is not awaiting financial approval (Status: ${order.status}).`);
        return;
      }
      setSearchedOrder(order);
      setApprovedAmount(order.loanInfo?.requestedAmount || 0);
      setApprovedInterest(order.loanInfo?.interestRate || 0);
      setApprovedDuration(order.loanInfo?.termYears || 0);
      if (order.status === OrderStatus.Created) {
        updateOrderStatus(orderNumber, OrderStatus.FinancialApprovalInProgress, currentUser?.username || 'System', 'Financial review started.');
      }
    } else {
      setSearchedOrder(undefined);
      setSearchError(`Order with number "${orderNumber}" not found.`);
    }
  };

  const handleSubmitApproval = () => {
    if (!searchedOrder || !currentUser) return;

    if(approvedAmount <= 0 || approvedInterest <=0 || approvedDuration <=0) {
        setModalMessage("All approval fields (Amount, Interest, Duration) must be positive values.");
        setIsModalOpen(true);
        return;
    }

    const approvalDetails: FinancialApproval = {
      approvedAmount,
      approvedInterest,
      approvedDuration,
      approvedBy: currentUser.username,
      approvedAt: new Date(),
      notes,
    };

    const success = updateOrderFinancialApproval(searchedOrder.orderNumber, approvalDetails);
    if (success) {
      setModalMessage(`Financials for order ${searchedOrder.orderNumber} approved successfully.`);
      setSearchedOrder(findOrder(searchedOrder.orderNumber)); // Refresh order
    } else {
      setModalMessage(`Failed to approve financials for order ${searchedOrder.orderNumber}.`);
    }
    setIsModalOpen(true);
  };
  
  const handleReject = () => {
    if(!searchedOrder || !currentUser) return;
    updateOrderStatus(searchedOrder.orderNumber, OrderStatus.FinancialRejected, currentUser.username, `Financials rejected. Notes: ${notes || 'No notes'}`);
    setModalMessage(`Financials for order ${searchedOrder.orderNumber} have been marked as rejected.`);
    setIsModalOpen(true);
    setSearchedOrder(findOrder(searchedOrder.orderNumber)); // Refresh order
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Financial Approval</h2>
      <OrderSearchForm onSearch={handleSearch} />
      {searchError && <p className="text-red-400 bg-red-900 bg-opacity-30 p-3 rounded-md">{searchError}</p>}

      {searchedOrder && searchedOrder.loanRequired && (searchedOrder.status === OrderStatus.FinancialApprovalInProgress || searchedOrder.status === OrderStatus.Created) && (
        <div className="mt-6 p-6 bg-zyberion-light-blue rounded-lg shadow">
          <h3 className="text-xl font-semibold text-zyberion-teal mb-4">Approve Loan for Order: {searchedOrder.orderNumber}</h3>
          <div className="mb-4 p-3 bg-input-bg rounded">
            <p><strong>Account:</strong> {searchedOrder.accountName}</p>
            <p><strong>Requested Amount:</strong> ${searchedOrder.loanInfo?.requestedAmount.toLocaleString()}</p>
            <p><strong>Car:</strong> {searchedOrder.carInfo.modelName} - Total ${searchedOrder.carInfo.totalPrice.toLocaleString()}</p>
            <p><strong>Requested Plan:</strong> {searchedOrder.loanInfo?.bankName} - {searchedOrder.loanInfo?.planName} ({searchedOrder.loanInfo?.interestRate}% for {searchedOrder.loanInfo?.termYears} years)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input label="Approved Loan Amount ($)" type="number" value={approvedAmount} onChange={e => setApprovedAmount(parseFloat(e.target.value))} />
            <Input label="Approved Interest Rate (%)" type="number" step="0.01" value={approvedInterest} onChange={e => setApprovedInterest(parseFloat(e.target.value))} />
            <Input label="Approved Duration (Years)" type="number" value={approvedDuration} onChange={e => setApprovedDuration(parseInt(e.target.value))} />
          </div>
          <Input label="Notes (Optional)" type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Approval or rejection notes"/>

          <div className="flex justify-end space-x-3 mt-6">
            <Button onClick={handleReject} variant="danger">Reject Loan</Button>
            <Button onClick={handleSubmitApproval} variant="primary">Approve Loan</Button>
          </div>
        </div>
      )}
      {searchedOrder && searchedOrder.status === OrderStatus.FinancialApproved && (
         <div className="mt-6 p-6 bg-green-900 bg-opacity-50 rounded-lg shadow text-center">
            <p className="text-xl text-green-300 font-semibold">Order {searchedOrder.orderNumber} has already been financially approved.</p>
         </div>
      )}
      {searchedOrder && searchedOrder.status === OrderStatus.FinancialRejected && (
         <div className="mt-6 p-6 bg-red-900 bg-opacity-50 rounded-lg shadow text-center">
            <p className="text-xl text-red-300 font-semibold">Order {searchedOrder.orderNumber} financials were rejected.</p>
         </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Financial Approval Status">
        <p>{modalMessage}</p>
        <div className="mt-4 flex justify-end">
            <Button onClick={() => setIsModalOpen(false)} variant="primary">OK</Button>
        </div>
      </Modal>
    </div>
  );
};
    