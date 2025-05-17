
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Updated publishable key to use the one provided
const PUBLISHABLE_KEY = "pk_test_aW50aW1hdGUtdGFycG9uLTU5LmNsZXJrLmFjY291bnRzLmRldiQ";

const AuthContext = createContext<{
  isLoading: boolean;
  userId: string | null;
  userProfileId: string | null;
}>({
  isLoading: true,
  userId: null,
  userProfileId: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userProfileId, setUserProfileId] = useState<string | null>(null);
  const { user, isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    const setupUserProfile = async () => {
      if (isSignedIn && user) {
        try {
          // Check if user already exists in our Supabase database
          const { data: existingUser } = await supabase
            .from('users')
            .select('id, clerk_id')
            .eq('clerk_id', user.id)
            .single();

          if (existingUser) {
            setUserProfileId(existingUser.id);
          } else {
            // Create a new user profile
            const { data: newUser, error } = await supabase
              .from('users')
              .insert({
                clerk_id: user.id,
                name: `${user.firstName} ${user.lastName}`,
                email: user.primaryEmailAddress?.emailAddress,
              })
              .select('id')
              .single();

            if (error) {
              console.error('Error creating user profile:', error);
              toast({
                title: 'Profile Error',
                description: 'There was a problem setting up your profile.',
                variant: 'destructive'
              });
            } else {
              setUserProfileId(newUser.id);
            }
          }
        } catch (error) {
          console.error('Error in profile setup:', error);
        }
      } else {
        setUserProfileId(null);
      }
      setIsLoading(false);
    };

    setupUserProfile();
  }, [user, isSignedIn, isLoaded]);

  return (
    <AuthContext.Provider 
      value={{ 
        isLoading: isLoading || !isLoaded, 
        userId: user?.id || null,
        userProfileId 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const ClerkAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AuthProvider>{children}</AuthProvider>
    </ClerkProvider>
  );
};

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};
