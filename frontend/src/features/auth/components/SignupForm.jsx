import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../../../components/ui/Input';
import PasswordInput from '../../../components/ui/PasswordInput';
import Button from '../../../components/ui/Button';
import Checkbox from '../../../components/ui/Checkbox';
import { Link } from 'react-router-dom';

const signupSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the Terms of Service',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function SignupForm({ onSubmit, isLoading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Input
        id="fullName"
        label="Full Name"
        type="text"
        placeholder="John Doe"
        autoComplete="name"
        error={errors.fullName?.message}
        {...register('fullName')}
      />
      <Input
        id="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <PasswordInput
        id="password"
        label="Password"
        placeholder="••••••••"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register('password')}
      />
      <PasswordInput
        id="confirmPassword"
        label="Confirm Password"
        placeholder="••••••••"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />
      
      <Checkbox
        id="agreeToTerms"
        label={
          <>
            I agree to the <Link to="/terms" style={linkHighlight}>Terms of Service</Link> and <Link to="/privacy" style={linkHighlight}>Privacy Policy</Link>
          </>
        }
        error={errors.agreeToTerms?.message}
        {...register('agreeToTerms')}
      />

      <Button type="submit" variant="primary" fullWidth isLoading={isLoading} style={{ marginTop: '12px' }}>
        Create Account
      </Button>
    </form>
  );
}

const linkHighlight = {
  color: '#818cf8',
  textDecoration: 'none',
  fontWeight: 500,
};
