import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, CheckCircle, Shield, Briefcase, Layout } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

const Register = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: searchParams.get('role') || 'user'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card-dark p-10 rounded-3xl shadow-2xl relative">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-white mb-2">Create Account</h2>
        <p className="text-slate-400">Join the premium home design community.</p>
      </div>

      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => handleRoleSelect('user')}
          className={cn(
            "flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
            formData.role === 'user' 
              ? "bg-gold border-gold text-navy font-bold shadow-lg shadow-gold/20" 
              : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
          )}
        >
          <User className="w-6 h-6" />
          <span className="text-xs uppercase tracking-wider font-bold">I'm a Client</span>
        </button>
        <button 
          onClick={() => handleRoleSelect('engineer')}
          className={cn(
            "flex-1 p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
            formData.role === 'engineer' 
              ? "bg-gold border-gold text-navy font-bold shadow-lg shadow-gold/20" 
              : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
          )}
        >
          <Briefcase className="w-6 h-6" />
          <span className="text-xs uppercase tracking-wider font-bold">I'm an Engineer</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-300 ml-1">Full Name</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-gold transition-colors" />
            <input 
              type="text" 
              autoComplete="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-1.5xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
              placeholder="John Doe"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-300 ml-1">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-gold transition-colors" />
            <input 
              type="email" 
              autoComplete="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-1.5xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
              placeholder="john@example.com"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-300 ml-1">Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-gold transition-colors" />
            <input 
              type="password" 
              autoComplete="new-password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-1.5xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <div className="flex items-start gap-3 py-2 px-1">
          <div className="mt-1">
            <CheckCircle className="w-4 h-4 text-gold" />
          </div>
          <p className="text-xs text-slate-400">
            I agree to the <span className="text-gold font-bold">Terms of Service</span> and acknowledge the <span className="text-gold font-bold">Privacy Policy</span>.
          </p>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-white text-navy font-bold py-4 rounded-2xl flex items-center justify-center gap-3 text-lg shadow-xl hover:bg-gold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-navy border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              Get Started <UserPlus className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-10 pt-8 border-t border-white/10 text-center">
        <p className="text-slate-400">Already a member?</p>
        <Link to="/login" className="inline-flex items-center gap-2 text-gold font-bold mt-2">
          Sign In to Your Dashboard
        </Link>
      </div>

      {/* Trust Badges */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
          <Shield className="w-4 h-4 text-gold/50" /> Secure Encryption
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
          <CheckCircle className="w-4 h-4 text-gold/50" /> Expert Verified
        </div>
      </div>
    </div>
  );
};

export default Register;
