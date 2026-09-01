import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Spinner } from '../ui/Spinner';

interface GoogleAuthButtonProps {
  mode?: 'signin' | 'signup';
  onError?: (errMessage: string) => void;
  className?: string;
}

const REAL_GOOGLE_CLIENT_ID = '1016186097944-gqfi12700g1mqnbfqi294emov3q2b0el.apps.googleusercontent.com';

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  mode = 'signin',
  onError,
  className = '',
}) => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGsiLoaded, setIsGsiLoaded] = useState(false);
  const buttonContainerRef = useRef<HTMLDivElement>(null);

  const googleClientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID || REAL_GOOGLE_CLIENT_ID;

  const handleCredentialResponse = async (response: any) => {
    if (!response.credential) {
      onError?.('Google authentication did not return a valid credential.');
      return;
    }

    setIsProcessing(true);
    try {
      const { user, hasCompletedOnboarding } = await loginWithGoogle(response.credential);
      
      if (hasCompletedOnboarding) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    } catch (err: any) {
      onError?.(err.message || 'Google authentication failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const initGsi = () => {
      if (typeof (window as any).google !== 'undefined' && (window as any).google.accounts) {
        try {
          (window as any).google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });
          setIsGsiLoaded(true);
        } catch (e) {
          console.error('[Google GSI] Init error:', e);
        }
      }
    };

    if (document.getElementById('google-gsi-script')) {
      initGsi();
    } else {
      const script = document.createElement('script');
      script.id = 'google-gsi-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGsi;
      document.head.appendChild(script);
    }
  }, [googleClientId]);

  const handleCustomClick = () => {
    if (isProcessing) return;

    if (typeof (window as any).google === 'undefined' || !(window as any).google.accounts) {
      onError?.('Google Identity Services is loading. Please check your internet connection.');
      return;
    }

    try {
      // Use OAuth2 token client for a clean, non-lagging popup
      const client = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: googleClientId,
        scope: 'openid email profile',
        callback: async (tokenResponse: any) => {
          if (tokenResponse.error) {
            onError?.('Google login cancelled or failed.');
            return;
          }

          if (tokenResponse.access_token) {
            setIsProcessing(true);
            try {
              // Fetch verified profile from Google UserInfo
              const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              });
              const userData = await userRes.json();
              
              if (!userData.email) {
                throw new Error('Unable to retrieve email from Google.');
              }

              // Send to backend
              const { user, hasCompletedOnboarding } = await loginWithGoogle(
                JSON.stringify({
                  email: userData.email,
                  name: userData.name,
                  picture: userData.picture,
                  sub: userData.sub,
                  access_token: tokenResponse.access_token,
                })
              );

              if (hasCompletedOnboarding) {
                navigate('/dashboard', { replace: true });
              } else {
                navigate('/onboarding', { replace: true });
              }
            } catch (authErr: any) {
              onError?.(authErr.message || 'Failed to complete Google authentication.');
            } finally {
              setIsProcessing(false);
            }
          }
        },
      });

      client.requestAccessToken({ prompt: 'select_account' });
    } catch (err: any) {
      onError?.(err.message || 'Failed to open Google login window.');
    }
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleCustomClick}
        disabled={isProcessing}
        className={
          'w-full h-12 px-4 rounded-xl border border-white/[0.12] bg-[#0E1528] hover:bg-[#151F38] hover:border-white/[0.24] active:scale-[0.99] text-white font-medium text-sm transition-all flex items-center justify-center gap-3 shadow-md disabled:opacity-60 disabled:cursor-not-allowed group ' +
          className
        }
      >
        {isProcessing ? (
          <div className="flex items-center gap-2.5 text-slate-300">
            <Spinner size="sm" />
            <span>Signing in with Google...</span>
          </div>
        ) : (
          <>
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="font-semibold text-slate-100 group-hover:text-white">
              {mode === 'signup' ? 'Sign up with Google' : 'Continue with Google'}
            </span>
          </>
        )}
      </button>
      <div ref={buttonContainerRef} className="hidden" />
    </div>
  );
};
