import { Link } from 'react-router-dom';
import { useState } from 'react';
import Card from '../../../components/ui/Card';
import ForgotPasswordForm from '../components/ForgotPasswordForm';

export default function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (data) => {
    // Mock sending email
    console.log('Sending reset link to:', data.email);
    setIsSubmitted(true);
  };

  return (
    <Card animated size="sm">
      <div className="flex flex-col items-center text-center mb-9">
        <h2 className="m-0 mb-2 text-lg font-bold text-foreground font-sans">Reset Password</h2>
        <p className="m-0 text-sm text-muted-foreground font-sans tracking-wide leading-relaxed">
          {isSubmitted 
            ? "Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder."
            : "Enter your email address and we'll send you a link to reset your password."}
        </p>
      </div>

      {!isSubmitted && (
        <ForgotPasswordForm onSubmit={handleSubmit} isLoading={false} />
      )}

      <div className="mt-7 flex flex-col items-center gap-4">
        <p className="m-0 text-sm text-muted-foreground font-sans">
          <Link to="/login" className="text-primary hover:text-primary/90 font-semibold transition-colors decoration-none">← Back to Login</Link>
        </p>
      </div>
    </Card>
  );
}

/* ── Styles removed in favor of Tailwind CSS ── */
