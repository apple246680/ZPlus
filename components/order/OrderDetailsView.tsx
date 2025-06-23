
import React from 'react';
import { Order, OrderStatus } from '../../types';
import { Button } from '../ui/Button';

interface OrderDetailsViewProps {
  order: Order;
}

const DetailItem: React.FC<{ label: string; value?: React.ReactNode; className?: string }> = ({ label, value, className }) => (
  <div className={`py-1 ${className}`}>
    <span className="font-semibold text-zyberion-gray w-1/3 inline-block">{label}:</span>
    <span className="text-zyberion-light-gray">{value !== undefined && value !== null ? value : 'N/A'}</span>
  </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6 p-4 bg-zyberion-light-blue rounded-lg shadow">
    <h3 className="text-xl font-semibold text-zyberion-teal mb-3 border-b border-zyberion-dark-gray pb-2">{title}</h3>
    {children}
  </div>
);

export const OrderDetailsView: React.FC<OrderDetailsViewProps> = ({ order }) => {
  const { 
    orderNumber, accountName, accountEmail, createdAt, createdBy, storeName, 
    carInfo, loanRequired, loanInfo, status, progress, totalOrderAmount,
    financialApproval, vehicleDelivery, auditLog 
  } = order;

  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Order Details: {orderNumber}</h2>
        <Button onClick={() => alert('Save as PDF functionality not implemented.')} variant="secondary">
          Save As PDF
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-zyberion-dark-gray rounded-full h-2.5 mb-4">
        <div 
            className="bg-zyberion-teal h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-right text-sm text-zyberion-gray -mt-3 mb-4">Current: {progress}% ({status})</p>

      <Section title="Basic Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <DetailItem label="Order Number" value={orderNumber} />
          <DetailItem label="Total Amount" value={`$${totalOrderAmount.toLocaleString()}`} />
          <DetailItem label="Account Name" value={accountName} />
          <DetailItem label="Account Email" value={accountEmail} />
          <DetailItem label="Created On" value={new Date(createdAt).toLocaleString()} />
          <DetailItem label="Created By" value={createdBy} />
          <DetailItem label="Store" value={storeName} />
          <DetailItem label="Loan Required" value={loanRequired ? 'Yes' : 'No'} />
        </div>
      </Section>

      <Section title="Car (Vehicle) Information">
        <DetailItem label="Model" value={carInfo.modelName} />
        <DetailItem label="Base Price" value={`$${carInfo.basePrice.toLocaleString()}`} />
        {carInfo.selectedEquipment.length > 0 && (
          <div>
            <span className="font-semibold text-zyberion-gray">Equipment:</span>
            <ul className="list-disc list-inside ml-4 text-zyberion-light-gray">
              {carInfo.selectedEquipment.map((eq, index) => (
                <li key={index}>{eq.name} (${eq.price.toLocaleString()})</li>
              ))}
            </ul>
          </div>
        )}
        <DetailItem label="Total Car Price" value={`$${carInfo.totalPrice.toLocaleString()}`} className="mt-2 pt-2 border-t border-zyberion-dark-gray font-bold" />
      </Section>

      {loanRequired && loanInfo && (
        <Section title="Loan Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <DetailItem label="Institution" value={loanInfo.bankName} />
            <DetailItem label="Plan" value={loanInfo.planName} />
            <DetailItem label="Requested Amount" value={`$${loanInfo.requestedAmount.toLocaleString()}`} />
            <DetailItem label="Interest Rate" value={`${loanInfo.interestRate}%`} />
            <DetailItem label="Term" value={`${loanInfo.termYears} years`} />
            {financialApproval && (
                <>
                <DetailItem label="Approved Amount" value={`$${financialApproval.approvedAmount.toLocaleString()}`} className="text-green-400 font-semibold"/>
                <DetailItem label="Approved Rate" value={`${financialApproval.approvedInterest}%`} className="text-green-400 font-semibold"/>
                <DetailItem label="Approved Term" value={`${financialApproval.approvedDuration} years`} className="text-green-400 font-semibold"/>
                </>
            )}
          </div>
        </Section>
      )}

      {/* Placeholder for Associate Car - this belongs more in Vehicle Delivery or a dedicated component */}
      { (status === OrderStatus.FinancialApproved || status === OrderStatus.VehicleDeliveryInProgress || status === OrderStatus.Delivered || status === OrderStatus.Finished) && (
        <Section title="Associate Car (Vehicle) to Order">
            {vehicleDelivery ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <DetailItem label="VIN" value={vehicleDelivery.vin} />
                    <DetailItem label="Manufacture Date" value={vehicleDelivery.manufactureDate} />
                    {vehicleDelivery.deliveryDate && <DetailItem label="Delivery Date" value={new Date(vehicleDelivery.deliveryDate).toLocaleDateString()} />}
                    {vehicleDelivery.notes && <DetailItem label="Notes" value={vehicleDelivery.notes} />}
                 </div>
            ) : (
                <p className="text-zyberion-gray">Vehicle not yet associated. Go to Vehicle Delivery.</p>
            )}
        </Section>
      )}

      <Section title="Audit Log">
        <div className="max-h-60 overflow-y-auto space-y-2 text-sm">
          {auditLog.slice().reverse().map((log, index) => ( // Show newest first
            <div key={index} className="p-2 bg-input-bg rounded text-xs">
              <span className="font-semibold text-zyberion-teal">{new Date(log.timestamp).toLocaleString()}</span>
              <span className="text-zyberion-gray"> [{log.user}]: </span>
              <span className="text-zyberion-light-gray">{log.action}</span>
              {log.details && <p className="text-xs text-gray-500 pl-2">Details: {log.details}</p>}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};
    