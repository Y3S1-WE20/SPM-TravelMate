
import React, { useEffect, useState } from 'react';
import { ClerkProvider, SignedIn, SignedOut, SignIn, SignUp, UserButton, useUser, useAuth } from '@clerk/clerk-react';

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function Profile() {
	const { user } = useUser();
	const { getToken } = useAuth();
	const [backendUser, setBackendUser] = useState(null);

	useEffect(() => {
		if (user) {
			// Call backend to save/get user profile
			const fetchProfile = async () => {
				try {
					const token = await getToken();
					const response = await fetch('http://localhost:5001/auth/profile', {
						headers: {
							'Authorization': `Bearer ${token}`
						}
					});
					const data = await response.json();
					setBackendUser(data);
					console.log('Backend user data:', data);
				} catch (error) {
					console.error('Error fetching profile:', error);
				}
			};
			fetchProfile();
		}
	}, [user, getToken]);

	if (!user) return null;
	return (
		<div>
			<h2>Welcome, {user.firstName} {user.lastName}</h2>
			<p>Email: {user.primaryEmailAddress.emailAddress}</p>
			<p>Role: {user.privateMetadata?.role || 'user'}</p>
			{backendUser && <p>Backend ID: {backendUser.id}</p>}
			<UserButton />
		</div>
	);
}


function Login() {
	return (
		<ClerkProvider publishableKey={clerkPubKey}>
			<SignedIn>
				<Profile />
			</SignedIn>
			<SignedOut>
				<SignIn />
			</SignedOut>
		</ClerkProvider>
	);
}

export default Login;
