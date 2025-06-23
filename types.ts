
export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  name: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  price: number;
}

export interface CarModel {
  id: string;
  name: string;
  basePrice: number;
  availableEquipmentIds: string[];
  imageUrl?: string;
}

export interface LoanPlanDetails {
  id: string;
  name: string;
  interestRate: number;
  termYears: number;
}

export interface Bank {
  id: string;
  name: string;
  minInterest: number;
  maxInterest: number;
  minTerm: number;
  maxTerm: number;
  loanPlans: LoanPlanDetails[];
}

export interface Store {
    id: string;
    name: string;
}

export enum OrderStatus {
  Draft = 'Draft',
  Created = 'Created',
  FinancialApprovalInProgress = 'Financial Approval In Progress',
  FinancialApproved = 'Financial Approved',
  FinancialRejected = 'Financial Rejected',
  VehicleDeliveryInProgress = 'Vehicle Delivery In Progress',
  Delivered = 'Delivered', // Vehicle associated, ready for customer
  Finished = 'Finished', // Customer took delivery
  Cancelled = 'Cancelled',
}

export interface OrderCarInfo {
  modelId: string;
  modelName: string;
  basePrice: number;
  selectedEquipment: EquipmentItem[];
  totalPrice: number;
}

export interface OrderLoanInfo {
  bankId: string;
  bankName: string;
  planId: string;
  planName: string;
  requestedAmount: number; // Initial requested amount
  interestRate: number;
  termYears: number;
  approvedAmount?: number; // Final approved amount
}

export interface FinancialApproval {
    approvedInterest: number;
    approvedDuration: number;
    approvedAmount: number;
    approvedBy: string;
    approvedAt: Date;
    notes?: string;
}

export interface VehicleDelivery {
    vin: string;
    manufactureDate: string;
    deliveryDate?: Date;
    notes?: string;
}

export interface AuditLogEntry {
    timestamp: Date;
    action: string;
    user: string;
    details?: string;
}

export interface Order {
  orderNumber: string;
  accountId: string;
  accountName: string;
  accountEmail: string;
  storeId: string;
  storeName: string;
  carInfo: OrderCarInfo;
  loanRequired: boolean;
  loanInfo?: OrderLoanInfo;
  status: OrderStatus;
  progress: number; // 0-100
  createdAt: Date;
  createdBy: string; // username
  updatedAt?: Date;
  financialApproval?: FinancialApproval;
  vehicleDelivery?: VehicleDelivery;
  auditLog: AuditLogEntry[];
  totalOrderAmount: number;
}

// Wizard state is a partial order
export type OrderFormData = Partial<Omit<Order, 'orderNumber' | 'status' | 'progress' | 'createdAt' | 'createdBy' | 'auditLog' | 'totalOrderAmount'>> & {
  // Specific fields for wizard steps if needed
  selectedCarModel?: CarModel;
  selectedBank?: Bank;
  selectedLoanPlan?: LoanPlanDetails;
  searchUserTerm?: string;
  foundUser?: User;
};

export interface OrderCreationData {
    accountId: string;
    accountName: string;
    accountEmail: string;
    storeId: string;
    storeName: string;
    carInfo: OrderCarInfo;
    loanRequired: boolean;
    loanInfo?: OrderLoanInfo;
    totalOrderAmount: number;
}
    