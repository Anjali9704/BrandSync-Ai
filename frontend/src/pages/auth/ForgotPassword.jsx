import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ email }) => {
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
      toast.success('Password reset link dispatched');
    } catch (err) {
      toast.error(err.message || 'Failed to dispatch reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F4] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#244C3A] text-white flex items-center justify-center shadow-sm mb-3">
            <ShieldCheck size={26} strokeWidth={2.2} />
          </div>
          <div className="text-xl font-bold text-[#244C3A] tracking-tight">BrandSync AI</div>
        </div>

        <div className="bg-white border border-[#DCE3DA] rounded-xl p-8 shadow-card">
          {sent ? (
            <div className="text-center py-3">
              <div className="w-12 h-12 rounded-full bg-[#EBF2ED] text-[#244C3A] flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={24} />
              </div>
              <h2 className="text-base font-bold text-[#252B27] mb-1">Check your inbox</h2>
              <p className="text-xs text-[#737B75] mb-6 leading-relaxed">
                We have dispatched password recovery instructions to your corporate email.
              </p>
              <Link to="/login" className="text-xs font-semibold text-[#244C3A] hover:underline">
                ← Return to sign in
              </Link>
            </div>
          ) : (
            <>
              <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-[#737B75] hover:text-[#252B27] mb-4 transition-colors">
                <ArrowLeft size={13} /> Back to sign in
              </Link>
              <h2 className="text-lg font-bold text-[#252B27] mb-1">Reset Password</h2>
              <p className="text-xs text-[#737B75] mb-5">
                Enter your registered email address and we'll send you recovery instructions.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <Input
                  label="Work Email Address"
                  type="email"
                  placeholder="you@company.com"
                  required
                  leftIcon={<Mail size={15} />}
                  error={errors.email?.message}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                  })}
                />
                <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
                  Send Recovery Link
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
