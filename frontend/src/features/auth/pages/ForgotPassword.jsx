import { Link } from 'react-router-dom';
import { useState } from 'react';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import authService from '../services/auth.service';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    setError(null);
    setStep(3);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await authService.resetPassword({ email, otp, newPassword });
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card animated size="sm">
      <div className="flex flex-col items-center text-center mb-9">
        <h2 className="m-0 mb-2 text-lg font-bold text-foreground font-sans">Reset Password</h2>
        <p className="m-0 text-sm text-muted-foreground font-sans tracking-wide leading-relaxed">
          {step === 1 && "Enter your email address and we'll send you an OTP to reset your password."}
          {step === 2 && "Enter the 6-digit OTP sent to your email."}
          {step === 3 && "Enter your new password."}
          {step === 4 && "Your password has been reset successfully. You can now log in."}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
          {error}
        </div>
      )}

      {step === 1 && (
        <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" variant="primary" fullWidth isLoading={isLoading} style={{ marginTop: '12px' }}>
            Send OTP
          </Button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Input
            id="otp"
            label="One-Time Password (OTP)"
            type="text"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button type="submit" variant="primary" fullWidth style={{ marginTop: '12px' }}>
            Verify OTP
          </Button>
          <div className="text-center mt-2">
            <button 
              type="button" 
              onClick={handleSendOtp} 
              disabled={isLoading}
              className="text-sm text-primary hover:underline bg-transparent border-none cursor-pointer"
            >
              {isLoading ? 'Sending...' : 'Resend OTP'}
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Input
            id="newPassword"
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button type="submit" variant="primary" fullWidth isLoading={isLoading} style={{ marginTop: '12px' }}>
            Reset Password
          </Button>
        </form>
      )}

      <div className="mt-7 flex flex-col items-center gap-4">
        <p className="m-0 text-sm text-muted-foreground font-sans">
          <Link to="/login" className="text-primary hover:text-primary/90 font-semibold transition-colors decoration-none">← Back to Login</Link>
        </p>
      </div>
    </Card>
  );
}
