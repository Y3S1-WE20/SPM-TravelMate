import React, { useState } from 'react';
import { useSignUp, SignUp, ClerkProvider } from '@clerk/clerk-react';

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function CustomSignUp() {
  const [role, setRole] = useState('user');
  const { signUp } = useSignUp();

  // Called after Clerk sign up is complete
  const handleCompleteSignUp = async (user) => {
    // Set role in Clerk private metadata
    await user.update({
      privateMetadata: { role },
    });
    // Optionally redirect or show a message
  };

  return (
    <div>
      <label htmlFor="role">Register as:</label>
      <select id="role" value={role} onChange={e => setRole(e.target.value)}>
        <option value="user">User</option>
        <option value="hotel owner">Hotel Owner</option>
      </select>
      <SignUp
        routing="hash"
        afterSignUp={handleCompleteSignUp}
      />
    </div>
  );
}

function Register() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <CustomSignUp />
    </ClerkProvider>
  );
}

export default Register;
