
import { User, CarModel, EquipmentItem, Bank, LoanPlanDetails, Store } from './types';

export const APP_TITLE = "Zyberion Management System";

export const MOCK_USERS: User[] = [
  { id: 'admin01', username: 'admin', email: 'admin@zyberion.com', phone: '000-000-0000', name: 'Administrator' },
  { id: 'user1', username: 'john.doe', email: 'john.doe@example.com', phone: '123-456-7890', name: 'John Doe' },
  { id: 'user2', username: 'jane.smith', email: 'jane.smith@example.com', phone: '987-654-3210', name: 'Jane Smith' },
  { id: 'user3', username: 'alice.w', email: 'alice.w@example.com', phone: '555-123-4567', name: 'Alice Wonderland' },
];

export const MOCK_STORES: Store[] = [
    { id: 'store1', name: 'ZYBERION Flagship Centralis' },
    { id: 'store2', name: 'ZYBERION Northpoint Branch 020' },
    { id: 'store3', name: 'ZYBERION South Bay Gallery' },
];

export const MOCK_EQUIPMENT_ITEMS: EquipmentItem[] = [
  { id: 'eq1', name: 'Premium Sound System', price: 1800 },
  { id: 'eq2', name: 'Panoramic Sunroof', price: 1200 },
  { id: 'eq3', name: 'AI Autopilot Package', price: 5500 },
  { id: 'eq4', name: 'Vegan Leather Seats (Cream)', price: 2200 },
  { id: 'eq5', name: 'Adaptive Matrix Headlights', price: 900 },
  { id: 'eq6', name: '22" Aero Wheels', price: 2500 },
  { id: 'eq7', name: 'Performance Boost Upgrade', price: 3000 },
];

export const MOCK_CAR_MODELS: CarModel[] = [
  { 
    id: 'sedan_x1', 
    name: 'Zyberion Sedan X1', 
    basePrice: 45000, 
    availableEquipmentIds: ['eq1', 'eq2', 'eq4', 'eq5'],
    imageUrl: 'https://picsum.photos/seed/sedanx1/400/250'
  },
  { 
    id: 'suv_y7', 
    name: 'Zyberion SUV Y7 (7-seater)', 
    basePrice: 62000, 
    availableEquipmentIds: ['eq1', 'eq2', 'eq3', 'eq4', 'eq5', 'eq6'],
    imageUrl: 'https://picsum.photos/seed/suvy7/400/250'
  },
  { 
    id: 'truck_z3', 
    name: 'Zyberion Truck Z3', 
    basePrice: 75000, 
    availableEquipmentIds: ['eq2', 'eq3', 'eq5', 'eq6', 'eq7'],
    imageUrl: 'https://picsum.photos/seed/truckz3/400/250'
  },
];

const bank1Plans: LoanPlanDetails[] = [
  { id: 'b1p1', name: 'Standard 3yr @ 3.5%', interestRate: 3.5, termYears: 3 },
  { id: 'b1p2', name: 'Extended 5yr @ 4.0%', interestRate: 4.0, termYears: 5 },
  { id: 'b1p3', name: 'Flexi 7yr @ 4.2%', interestRate: 4.2, termYears: 7 },
];

const bank2Plans: LoanPlanDetails[] = [
  { id: 'b2p1', name: 'Eco Saver 4yr @ 3.2%', interestRate: 3.2, termYears: 4 },
  { id: 'b2p2', name: 'MaxTerm 5yr @ 3.8%', interestRate: 3.8, termYears: 5 },
  { id: 'b2p3', name: 'Advantage 2yr @ 3.0%', interestRate: 3.0, termYears: 2 },
];

// Corresponds to image: Institution: 瑞豐國際投資銀行, Interest Rate: 9%, Loan Amount: 2,000,000, Interest Year: 4 years
// Let's make a bank that can have this plan.
const bank3Plans: LoanPlanDetails[] = [
    { id: 'rfp1', name: 'Special Offer 4yr @ 9.0%', interestRate: 9.0, termYears: 4 }, // Matches image
    { id: 'rfp2', name: 'Standard 5yr @ 8.5%', interestRate: 8.5, termYears: 5 },
];


export const MOCK_BANKS: Bank[] = [
  { 
    id: 'bank1', 
    name: 'Global Investment Bank', 
    minInterest: 2.5, maxInterest: 5.0, minTerm: 1, maxTerm: 7,
    loanPlans: bank1Plans
  },
  { 
    id: 'bank2', 
    name: 'Future Finance Corp', 
    minInterest: 3.0, maxInterest: 6.0, minTerm: 2, maxTerm: 5,
    loanPlans: bank2Plans
  },
  {
    id: 'bank3',
    name: 'RuiFeng International Investment Bank (瑞豐國際投資銀行)',
    minInterest: 7.0, maxInterest: 10.0, minTerm: 2, maxTerm: 6,
    loanPlans: bank3Plans
  }
];

export const WIZARD_STEPS = [
  { id: 'basic', name: 'Order Basic Information' },
  { id: 'car', name: 'Car (Vehicle) Information' },
  { id: 'loan', name: 'Loan Plan Information' },
  { id: 'confirm', name: 'Confirmation' },
];

export const generateOrderNumber = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const p1 = Array(3).fill(null).map(() => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  const p2 = Math.floor(1000 + Math.random() * 9000).toString();
  const p3 = Math.floor(1000 + Math.random() * 9000).toString();
  const p4 = Math.floor(10000 + Math.random() * 90000).toString();
  return `${p1}-${p2}-${p3}-${p4}`;
};