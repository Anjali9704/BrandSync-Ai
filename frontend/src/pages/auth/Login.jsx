import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, Mail, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';

const demoAccounts = [
  { label: 'Admin', email: 'admin@brandsync.ai' },
  { label: 'Brand Manager', email: 'manager@brandsync.ai' },
  { label: 'Content Creator', email: 'creator@brandsync.ai' },
  { label: 'Reviewer', email: 'reviewer@brandsync.ai' },
  { label: 'Agency', email: 'agency@brandsync.ai' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '', remember: false },
  });

  const from = location.state?.from?.pathname || '/dashboard';

  const onSubmit = async ({ email, password }) => {
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Successfully authenticated');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (email) => {
    setValue('email', email);
    setValue('password', 'Pass@123');
  };

  return (
    <div className="min-h-screen bg-[#F7F8F4] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#244C3A] text-white flex items-center justify-center shadow-sm mb-3">
            <ShieldCheck size={26} strokeWidth={2.2} />
          </div>
          <div className="text-2xl font-bold text-[#244C3A] tracking-tight">BrandSync AI</div>
          <div className="text-xs font-medium text-[#737B75] mt-1">One Brand. One Voice. One Standard.</div>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#DCE3DA] rounded-xl p-8 shadow-card">
          <h2 className="text-lg font-bold text-[#252B27] mb-1">Sign in to workspace</h2>
          <p className="text-xs text-[#737B75] mb-6">Enter your organizational credentials to continue.</p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <Input
              label="Work Email"
              type="email"
              placeholder="you@company.com"
              required
              leftIcon={<Mail size={15} />}
              error={errors.email?.message}
              {...register('email', {
                required: 'Work email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email' },
              })}
            />

            <Input
              label="Password"
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              required
              leftIcon={<Lock size={15} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="text-[#737B75] hover:text-[#252B27] cursor-pointer"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
              error={errors.password?.message}
              {...register('password', { required: 'Password is required' })}
            />

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 rounded border-[#CBD4C8] text-[#244C3A] focus:ring-[#244C3A]"
                  {...register('remember')}
                />
                <span className="text-xs text-[#737B75]">Remember this device</span>
              </label>
              <Link to="/forgot-password" className="text-xs font-medium text-[#244C3A] hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
              Sign In
            </Button>
          </form>
        </div>

        {/* Demo persona switcher */}
        <div className="mt-5 bg-white border border-[#DCE3DA] rounded-lg p-4 shadow-xs">
          <p className="text-[11px] font-bold text-[#737B75]  tracking-wider mb-2.5">
            Quick Persona Switcher (Password: Pass@123)
          </p>
          <div className="flex flex-wrap gap-1.5">
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => fillDemo(acc.email)}
                className="text-xs px-2.5 py-1.5 rounded-md bg-[#F7F8F4] border border-[#DCE3DA] text-[#252B27] hover:border-[#244C3A] hover:bg-[#EBF2ED] transition-colors cursor-pointer font-medium"
              >
                {acc.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-[#737B75] text-center mt-6">
          BrandSync AI — Team NOVASTACK · Enterprise Brand Governance
        </p>
      </div>
    </div>
  );
}
