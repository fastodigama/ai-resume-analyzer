// Import React and the useEffect hook
import React, {useEffect} from 'react';
// Import our custom store hook (likely handles authentication state)
import {usePuterStore} from "~/lib/puter";
// Import React Router hooks for location and navigation
import {useLocation, useNavigate} from "react-router";

// Page metadata (title + description for SEO/browser tab)
export const meta = () => ([
    { title: 'Resumind | Auth'},
    { name: 'description', content: 'Log into your account' },
])

// Main component for the Auth page
const auth = () => {
    // Pull values from our store: isLoading (loading state) and auth (authentication info)
    const { isLoading, auth } = usePuterStore();

    // Get current URL location (so we can read query params)
    const location = useLocation();

    // Extract the "next" query parameter from the URL (where to go after login)
    const next = location.search.split('next=')[1];

    // Hook to programmatically navigate between pages
    const navigate = useNavigate();

    // useEffect runs after the component renders
    // Here: if the user is authenticated, redirect them to the "next" page
    useEffect(() => {
        if(auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next]) // runs whenever auth.isAuthenticated or next changes

    // What the page shows on screen
    return (
        <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
            {/* Outer container with gradient border + shadow */}
            <div className="gradient-border shadow-lg">
                {/* Inner section with white background and padding */}
                <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
                    {/* Heading area */}
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1>Welcome</h1>
                        <h2>Log In to Continue Your Job Journey</h2>
                    </div>

                    {/* Authentication buttons */}
                    <div>
                        {isLoading ? (
                            // Show loading button while signing in
                            <button className="auth-button animate-pulse">
                                <p> Signing you in ...</p>
                            </button>
                        ) : (
                            <>
                                {auth.isAuthenticated ? (
                                    // If logged in, show Log Out button
                                    <button className="auth-button" onClick={auth.signOut}>
                                        <p>Log Out</p>
                                    </button>
                                ): (
                                    // If not logged in, show Log In button
                                    <button className="auth-button" onClick={auth.signIn}>
                                        <p>Log In</p>
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
};

// Export this component so it can be used in other parts of the app
export default auth;
