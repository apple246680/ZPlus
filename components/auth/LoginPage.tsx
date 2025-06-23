
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAppContext } from '../../contexts/AppContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { APP_TITLE } from '../../constants';

const ZyberionLogo: React.FC = () => (
  <svg viewBox="0 0 200 60" className="h-12 w-auto mb-2 text-zyberion-teal">
    <text x="0" y="45" fontFamily="Arial, sans-serif" fontSize="40" fontWeight="bold" fill="currentColor">
      Z Y B E R I O N
    </text>
  </svg>
);


export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAppContext();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const loginError = login(username, password);
    if (loginError) {
      setError(loginError);
      setIsLoading(false);
    } else {
      // Navigate to the default authenticated route on successful login
      navigate('/create-order', { replace: true });
      // No need to setIsLoading(false) here as the component will unmount/redirect
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zyberion-blue p-4">
      <div className="flex flex-col md:flex-row max-w-4xl w-full bg-zyberion-light-blue shadow-2xl rounded-lg overflow-hidden">
        {/* Left Panel - Image and Branding */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-between" style={{ backgroundImage: "url('https://picsum.photos/seed/zyberionbg/600/900')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="bg-black bg-opacity-50 p-6 rounded-lg">
            <ZyberionLogo />
            <p className="text-xl font-semibold text-white mt-2">EV COMPANY</p>
            <h1 className="text-4xl font-bold text-white mt-1">ZYBERION</h1>
          </div>
          <div className="mt-auto text-center bg-black bg-opacity-50 p-2 rounded-lg">
            <p className="text-lg font-medium text-white">Zyberion 賽博瑞昂</p>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-zyberion-light-gray mb-6 text-center">{APP_TITLE}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Username"
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              aria-required="true"
            />
            <Input
              label="Password"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              aria-required="true"
            />
            {error && <p role="alert" className="text-sm text-red-400 text-center py-2 bg-red-900 bg-opacity-30 rounded-md">{error}</p>}
             <div className="text-center text-red-400 h-6 mb-2" aria-live="polite">
                {/* Error message is now shown above if 'error' state is set */}
            </div>
            <Button type="submit" variant="primary" className="w-full" isLoading={isLoading} disabled={isLoading}>
              Sign In
            </Button>
            <Button type="button" variant="secondary" className="w-full mt-3" onClick={() => alert('Exit functionality not implemented in web app.')}>
              Exit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
