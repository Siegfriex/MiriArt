import React, { useState } from 'react';
import { H1, BodyText } from '../../../shared/ui/Typography';
import { Button } from '../../../shared/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    navigate('/app/home');
  };

  return (
    <div className="fixed inset-0 bg-dark-900 flex flex-col p-6 z-[90]">
      <header className="h-14 flex items-center">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
      </header>

      <div className="flex-1 flex flex-col justify-center space-y-8 max-w-sm mx-auto w-full">
        <div>
          <H1 className="text-white mb-2 text-3xl">Welcome Back</H1>
          <BodyText className="text-gray-400">Log in to continue your preparation.</BodyText>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
             <label className="text-xs text-gray-500 ml-1 font-medium uppercase tracking-wider">Email</label>
             <input 
               type="email" 
               className="w-full bg-dark-800 text-white rounded-xl px-4 py-4 outline-none focus:ring-1 focus:ring-lime-400 border border-white/5 transition-all placeholder-gray-600"
               placeholder="hello@dysprime.com"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
             />
          </div>
          <div className="space-y-1.5">
             <label className="text-xs text-gray-500 ml-1 font-medium uppercase tracking-wider">Password</label>
             <input 
               type="password" 
               className="w-full bg-dark-800 text-white rounded-xl px-4 py-4 outline-none focus:ring-1 focus:ring-lime-400 border border-white/5 transition-all placeholder-gray-600"
               placeholder="••••••••"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
             />
          </div>
          
          <div className="pt-6">
            <Button fullWidth type="submit" size="lg" className="rounded-2xl h-14 text-base font-bold">Log In</Button>
          </div>
        </form>

        <div className="text-center">
          <button onClick={() => navigate('/auth/signup')} className="text-sm text-gray-400 hover:text-lime-400 transition-colors p-2">
            Don't have an account? <span className="font-bold text-white">Sign Up</span>
          </button>
        </div>
      </div>
    </div>
  );
};