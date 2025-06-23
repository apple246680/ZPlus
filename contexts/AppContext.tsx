
import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { User, Order, OrderStatus, AuditLogEntry, OrderCreationData, FinancialApproval, VehicleDelivery } from '../types';
import { MOCK_USERS, generateOrderNumber } from '../constants';

interface AppContextType {
  currentUser: User | null;
  login: (username: string, pass: string) => string; // Returns error message or empty string on success
  logout: () => void;
  orders: Order[];
  addOrder: (orderData: OrderCreationData) => Order;
  findOrder: (orderNumber: string) => Order | undefined;
  updateOrderFinancialApproval: (orderNumber: string, approvalDetails: FinancialApproval) => boolean;
  updateOrderVehicleDelivery: (orderNumber: string, deliveryDetails: VehicleDelivery) => boolean;
  updateOrderStatus: (orderNumber: string, newStatus: OrderStatus, actionBy: string, details?: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  const login = useCallback((usernameInput: string, passInput: string): string => {
    const username = usernameInput.trim();
    const pass = passInput.trim();

    if (username.toLowerCase() === 'admin' && pass === 'admin') {
      // Find the admin user from MOCK_USERS or use a fallback if not found (though it should be found now)
      const adminUser: User = MOCK_USERS.find(u => u.username.toLowerCase() === 'admin') || { id: 'admin01', username: 'admin', email: 'admin@zyberion.com', phone: '000-000-0000', name: 'Administrator' };
      setCurrentUser(adminUser);
      return '';
    }
    return 'Invalid username or password.';
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const addOrder = useCallback((orderData: OrderCreationData): Order => {
    if (!currentUser) throw new Error("User must be logged in to create an order.");
    
    const newOrder: Order = {
      ...orderData,
      orderNumber: generateOrderNumber(),
      status: OrderStatus.Created,
      progress: 10, // Initial progress for created order
      createdAt: new Date(),
      createdBy: currentUser.username,
      auditLog: [{
        timestamp: new Date(),
        action: 'Order Created',
        user: currentUser.username,
        details: `Total: ${orderData.totalOrderAmount}`
      }]
    };
    setOrders(prevOrders => [...prevOrders, newOrder]);
    return newOrder;
  }, [currentUser]);

  const findOrder = useCallback((orderNumber: string): Order | undefined => {
    return orders.find(o => o.orderNumber === orderNumber);
  }, [orders]);

  const updateOrderStatus = useCallback((orderNumber: string, newStatus: OrderStatus, actionBy: string, details?: string): boolean => {
    setOrders(prevOrders => {
        return prevOrders.map(order => {
            if (order.orderNumber === orderNumber) {
                let newProgress = order.progress;
                switch(newStatus) {
                    case OrderStatus.Created: newProgress = 10; break;
                    case OrderStatus.FinancialApprovalInProgress: newProgress = 25; break;
                    case OrderStatus.FinancialApproved: newProgress = 50; break;
                    case OrderStatus.FinancialRejected: newProgress = order.progress; break; // Or reset to a specific state
                    case OrderStatus.VehicleDeliveryInProgress: newProgress = 75; break;
                    case OrderStatus.Delivered: newProgress = 90; break;
                    case OrderStatus.Finished: newProgress = 100; break;
                    case OrderStatus.Cancelled: newProgress = 0; break; // Or keep current progress but mark as cancelled
                }
                const newAuditLogEntry: AuditLogEntry = {
                    timestamp: new Date(),
                    action: `Status changed to ${newStatus}`,
                    user: actionBy,
                    details: details || `Progress: ${newProgress}%`
                };
                return { ...order, status: newStatus, progress: newProgress, updatedAt: new Date(), auditLog: [...order.auditLog, newAuditLogEntry] };
            }
            return order;
        });
    });
    return true;
  }, []);


  const updateOrderFinancialApproval = useCallback((orderNumber: string, approvalDetails: FinancialApproval): boolean => {
    const order = findOrder(orderNumber);
    if (!order || !currentUser) return false;

    setOrders(prevOrders => prevOrders.map(o => {
      if (o.orderNumber === orderNumber) {
        const updatedOrder = {
          ...o,
          financialApproval: approvalDetails,
          loanInfo: o.loanInfo ? { ...o.loanInfo, approvedAmount: approvalDetails.approvedAmount } : undefined,
          status: OrderStatus.FinancialApproved,
          progress: 50,
          updatedAt: new Date(),
          auditLog: [
            ...o.auditLog,
            {
              timestamp: new Date(),
              action: 'Financials Approved',
              user: currentUser.username,
              details: `Amount: ${approvalDetails.approvedAmount}, Rate: ${approvalDetails.approvedInterest}%, Term: ${approvalDetails.approvedDuration}yrs`
            }
          ]
        };
        return updatedOrder;
      }
      return o;
    }));
    return true;
  }, [findOrder, currentUser]);

  const updateOrderVehicleDelivery = useCallback((orderNumber: string, deliveryDetails: VehicleDelivery): boolean => {
    const order = findOrder(orderNumber);
    if (!order || !currentUser) return false;

    setOrders(prevOrders => prevOrders.map(o => {
      if (o.orderNumber === orderNumber) {
        const updatedOrder = {
          ...o,
          vehicleDelivery: deliveryDetails,
          status: OrderStatus.Delivered, // Or a more specific status like VehicleAssociated
          progress: 90, // Example progress
          updatedAt: new Date(),
          auditLog: [
            ...o.auditLog,
            {
              timestamp: new Date(),
              action: 'Vehicle Associated/Delivered',
              user: currentUser.username,
              details: `VIN: ${deliveryDetails.vin}, Mfg Date: ${deliveryDetails.manufactureDate}`
            }
          ]
        };
        return updatedOrder;
      }
      return o;
    }));
    return true;
  }, [findOrder, currentUser]);


  return (
    <AppContext.Provider value={{ currentUser, login, logout, orders, addOrder, findOrder, updateOrderFinancialApproval, updateOrderVehicleDelivery, updateOrderStatus }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};