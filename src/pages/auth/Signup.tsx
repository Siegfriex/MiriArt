import React, { useState } from 'react';
import { H1, BodyText } from '../../../shared/ui/Typography';
import { Button } from '../../../shared/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickname: '',
    grade: 'High School 3rd',
    domain: 'Visual Design'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate Signup
    navigate('/tutorial');
  };

  return (
    <div className="fixed inset-0 bg-dark-900 flex flex-col p-6 overflow-y-auto z-[90]">
      <header className="h-14 flex items-center flex-shrink-0">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
      </header>

      <div className="flex-1 flex flex-col justify-center space-y-6 py-4 max-w-sm mx-auto w-full">
        <div>
          <H1 className="text-white mb-2 text-3xl">Create Account</H1>
          <BodyText className="text-gray-400">Join dysprime for AI mentoring.</BodyText>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
             <label className="text-xs text-gray-500 ml-1 font-medium uppercase tracking-wider">Email</label>
             <input 
               type="email" 
               className="w-full bg-dark-800 text-white rounded-xl px-4 py-3.5 outline-none focus:ring-1 focus:ring-lime-400 border border-white/5 placeholder-gray-600"
               required
               value={formData.email}
               onChange={(e) => setFormData({...formData, email: e.target.value})}
               placeholder="name@example.com"
             />
          </div>
          <div className="space-y-1.5">
             <label className="text-xs text-gray-500 ml-1 font-medium uppercase tracking-wider">Password</label>
             <input 
               type="password" 
               className="w-full bg-dark-800 text-white rounded-xl px-4 py-3.5 outline-none focus:ring-1 focus:ring-lime-400 border border-white/5 placeholder-gray-600"
               required
               value={formData.password}
               onChange={(e) => setFormData({...formData, password: e.target.value})}
               placeholder="Create a password"
             />
          </div>
          <div className="space-y-1.5">
             <label className="text-xs text-gray-500 ml-1 font-medium uppercase tracking-wider">Nickname</label>
             <input 
               type="text" 
               className="w-full bg-dark-800 text-white rounded-xl px-4 py-3.5 outline-none focus:ring-1 focus:ring-lime-400 border border-white/5 placeholder-gray-600"
               required
               value={formData.nickname}
               onChange={(e) => setFormData({...formData, nickname: e.target.value})}
               placeholder="What should we call you?"
             />
          </div>
          
          <div className="flex gap-3">
             <div className="flex-1 space-y-1.5">
                <label className="text-xs text-gray-500 ml-1 font-medium uppercase tracking-wider">Grade</label>
                <div className="relative">
                  <select 
                    className="w-full bg-dark-800 text-white rounded-xl px-4 py-3.5 outline-none focus:ring-1 focus:ring-lime-400 border border-white/5 appearance-none text-sm"
                    value={formData.grade}
                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                  >
                    <option>High School 1st</option>
                    <option>High School 2nd</option>
                    <option>High School 3rd</option>
                    <option>Gap Year</option>
                  </select>
                </div>
             </div>
             <div className="flex-1 space-y-1.5">
                <label className="text-xs text-gray-500 ml-1 font-medium uppercase tracking-wider">Major</label>
                <div className="relative">
                  <select 
                    className="w-full bg-dark-800 text-white rounded-xl px-4 py-3.5 outline-none focus:ring-1 focus:ring-lime-400 border border-white/5 appearance-none text-sm"
                    value={formData.domain}
                    onChange={(e) => setFormData({...formData, domain: e.target.value})}
                  >
                    <option>Visual Design</option>
                    <option>Industrial Design</option>
                    <option>Fine Arts</option>
                    <option>Crafts</option>
                  </select>
                </div>
             </div>
          </div>

          <div className="pt-6">
            <Button fullWidth type="submit" size="lg" className="rounded-2xl h-14 text-base font-bold">Sign Up</Button>
          </div>
        </form>

        <div className="text-center pb-6">
          <button onClick={() => navigate('/auth/login')} className="text-sm text-gray-400 hover:text-lime-400 transition-colors p-2">
            Already have an account? <span className="font-bold text-white">Log In</span>
          </button>
        </div>
      </div>
    </div>
  );
};