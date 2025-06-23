
import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { NavLink, useNavigate } from 'react-router-dom'; // Using react-router-dom for NavLink
import { Button } from '../ui/Button';

interface NavItemProps {
  to: string;
  label: string;
  icon?: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ to, label, icon }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-4 py-3 rounded-md transition-colors duration-150 ease-in-out hover:bg-zyberion-light-blue ${
          isActive ? 'bg-zyberion-teal text-white font-semibold' : 'text-zyberion-gray hover:text-zyberion-light-gray'
        }`
      }
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      <span>{label}</span>
    </NavLink>
  );
};

// Placeholder icons (replace with actual SVGs or an icon library if desired)
const CreateOrderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>;
const OrderManagementIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 012.25 4.5h.75m0 0H21m-9 6h9M12 9H3.375M12 15h9M12 12h9m-9 3H3.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const FinancialApprovalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 012.25 4.5h.75S3 5.25 3 7.5m18 0c0-2.25-.75-3-2.25-3S16.5 5.25 16.5 7.5m-15 0c0-2.25.75-3 2.25-3S6 5.25 6 7.5m15 0c0 2.25-.75 3-2.25 3S16.5 9.75 16.5 7.5m-15 0c0 2.25.75 3 2.25 3S6 9.75 6 7.5m9 3.75m-9 0h18M3.75 14.25h16.5M3.75 10.5h16.5" /></svg>;
const VehicleDeliveryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>;
const SignOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>;


export const Sidebar: React.FC = () => {
  const { logout } = useAppContext();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/login'); // Assuming '/login' is your login route
    alert('Sign out successfully.'); // As per requirement
  };

  const ZyberionIcon: React.FC<{className?: string}> = ({className}) => (
    <svg viewBox="0 0 100 100" className={`w-8 h-8 ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8"/>
      <path d="M30 35 L70 35 L40 65 L70 65" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div className="w-64 bg-zyberion-blue h-full flex flex-col p-4 space-y-2 border-r border-zyberion-dark-gray shadow-lg">
      <div className="flex items-center space-x-2 p-2 mb-6 border-b border-zyberion-dark-gray pb-4">
        <ZyberionIcon className="text-zyberion-teal"/>
        <span className="text-xl font-bold text-white">ZYBERION</span>
      </div>
      <nav className="flex-grow space-y-1">
        <NavItem to="/create-order" label="Create Order" icon={<CreateOrderIcon />} />
        <NavItem to="/order-management" label="Order Management" icon={<OrderManagementIcon />} />
        <NavItem to="/financial-approval" label="Financial Approval" icon={<FinancialApprovalIcon />} />
        <NavItem to="/vehicle-delivery" label="Vehicle Delivery" icon={<VehicleDeliveryIcon />} />
      </nav>
      <div className="mt-auto pt-4 border-t border-zyberion-dark-gray">
        <Button onClick={handleSignOut} variant="secondary" className="w-full justify-start">
            <SignOutIcon />
            <span className="ml-3">Sign Out</span>
        </Button>
      </div>
    </div>
  );
};
    