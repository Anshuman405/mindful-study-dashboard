
import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { useLocation, Navigate } from 'react-router-dom';

const Auth = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get('mode') || 'sign-in';

  // If trying to access an invalid mode, redirect to sign-in
  if (mode !== 'sign-in' && mode !== 'sign-up') {
    return <Navigate to="/auth?mode=sign-in" replace />;
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-blue-500">
            StudyFlow
          </h1>
          <p className="text-muted-foreground mt-2">
            {mode === 'sign-in' 
              ? 'Sign in to access your study dashboard' 
              : 'Create an account to organize your academic life'}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-100">
          {mode === 'sign-in' ? (
            <>
              <SignIn routing="path" path="/auth" signUpUrl="/auth?mode=sign-up" />
              <p className="text-center text-sm text-muted-foreground mt-4">
                Don't have an account?{' '}
                <a href="/auth?mode=sign-up" className="text-studyflow-lavender hover:underline">
                  Sign up
                </a>
              </p>
            </>
          ) : (
            <>
              <SignUp routing="path" path="/auth" signInUrl="/auth?mode=sign-in" />
              <p className="text-center text-sm text-muted-foreground mt-4">
                Already have an account?{' '}
                <a href="/auth?mode=sign-in" className="text-studyflow-lavender hover:underline">
                  Sign in
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
