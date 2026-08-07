import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import GithubIcon from '../../../assets/icons/GithubIcon';
import GoogleIcon from '../../../assets/icons/GoogleIcon';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Divider from '../../../components/ui/Divider';
import SignupForm from '../components/SignupForm';
import { registerUser } from '../slice/authSlice';
import { useState } from 'react';

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.auth);
  const [signupError, setSignupError] = useState(null);

  const handleEmailSignup = async (data) => {
    setSignupError(null);
    const resultAction = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(resultAction)) {
      navigate('/dashboard');
    } else {
      setSignupError(resultAction.payload || 'Registration failed');
    }
  };

  return (
    <Card animated size="sm">
      <div className="flex flex-col items-center text-center mb-9">
        <h2 className="m-0 mb-2 text-lg font-bold text-foreground font-sans">⚡Create your account</h2>
        <p className="m-0 text-sm text-muted-foreground font-sans tracking-wide">GitHub • Docker • CI/CD • Instant Deployments</p>
      </div>

      <div className="flex flex-col gap-3 mb-2">
        <Button
          type="button"
          variant="oauth"
          fullWidth
          iconLeft={<GithubIcon size={18} />}
          onClick={() => { }}
        >
          Continue with GitHub
        </Button>
        <Button
          type="button"
          variant="oauth"
          fullWidth
          iconLeft={<GoogleIcon size={18} />}
          onClick={() => { }}
        >
          Continue with Google
        </Button>
      </div>

      <Divider>OR</Divider>

      {signupError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-md w-full text-center">
          {signupError}
        </div>
      )}

      <SignupForm onSubmit={handleEmailSignup} isLoading={status === 'loading'} />

      <div className="mt-7 flex flex-col items-center gap-4">
        <p className="m-0 text-sm text-muted-foreground font-sans">
          Already have an account? <Link to="/login" className="text-primary hover:text-primary/90 font-semibold transition-colors decoration-none">Sign In</Link>
        </p>
      </div>
    </Card>
  );
}

/* ── Styles removed in favor of Tailwind CSS ── */
