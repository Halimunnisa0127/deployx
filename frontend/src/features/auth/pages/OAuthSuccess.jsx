import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { refreshAccessToken, getCurrentUser } from '../slice/authSlice';

export default function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const processOAuth = async () => {
      try {
        // 1. Fetch access token via HttpOnly refresh token cookie
        const refreshAction = await dispatch(refreshAccessToken());
        
        if (refreshAccessToken.fulfilled.match(refreshAction)) {
          // 2. Fetch the user profile using the new token
          const resultAction = await dispatch(getCurrentUser());
          
          if (getCurrentUser.fulfilled.match(resultAction)) {
            // Success! 
            if (window.opener) {
              window.opener.postMessage('github_connected', '*');
            }
            // Otherwise, redirect to dashboard or back to wizard
            const wizardStep = sessionStorage.getItem('wizard_step');
            if (wizardStep) {
              navigate('/dashboard/projects/create');
            } else {
              navigate('/dashboard');
            }
            
            // Fallback via localStorage in case window.opener is lost across redirects
            localStorage.setItem('github_connected', 'true');
            
            window.close();
            
            // If not a popup or unable to close, navigate after a short delay
            setTimeout(() => {
              if (!window.closed) navigate('/dashboard');
            }, 500);
            
            return;
          } else {
            // Failed to fetch user profile
            throw new Error(resultAction.payload || 'Failed to fetch user profile');
          }
        } else {
          throw new Error('Failed to obtain access token.');
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError(err.message || 'An error occurred during authentication.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    processOAuth();
  }, [dispatch, navigate]);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)'
    }}>
      {error ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--danger)', marginBottom: '16px', fontSize: '24px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h2>Authentication Failed</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>{error}</p>
          <p style={{ color: 'var(--text-secondary)', marginTop: '16px', fontSize: '14px' }}>Redirecting to login...</p>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ 
            width: '40px', 
            height: '40px', 
            border: '3px solid var(--border)', 
            borderTopColor: 'var(--primary)', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px auto'
          }}></div>
          <h2>Completing Login...</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Please wait while we securely log you in.</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
