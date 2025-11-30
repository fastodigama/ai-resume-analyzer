// Import the type for route metadata (helps with typing in Remix/React Router)
import type { Route } from "./+types/home";

// Import our Navbar component
import Navbar from "~/componants/Navbar";

// Import a list of resumes (probably sample data or fetched constants)
import {resumes} from "~/constants";

// Import a card component that displays each resume
import ResumeCard from "~/componants/ResumeCard";

// Import our custom store hook (likely handles authentication and app state)
import {usePuterStore} from "~/lib/puter";

// Import navigation helpers from React Router
import {useLocation, useNavigate} from "react-router";

// Import React's useEffect hook
import {useEffect} from "react";

// This function sets up page metadata (title + description for SEO/browser tab)
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

// Main component for the Home page
export default function Home() {

    // Pull values from our store: isLoading (loading state) and auth (authentication info)
    const { isLoading, auth } = usePuterStore();

    // Hook to programmatically navigate between pages
    const navigate = useNavigate();

    // useEffect runs after the component renders
    // Here: if the user is NOT authenticated, redirect them to the /auth page
    useEffect(() => {
        if(!auth.isAuthenticated) navigate('/auth?next=/');
    }, [auth.isAuthenticated]) // runs whenever auth.isAuthenticated changes

  // What the page shows on screen
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    {/* Navbar at the top */}
    <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
            {/* Page heading */}
            <h1>Track Your Application & Resume Ratings</h1>
            <h2>Review your submissions and check AI-powered feedback.</h2>
        </div>

          {/* Only show resumes if we have at least one */}
          {resumes.length > 0 && (
              <div className={"resumes-section"}>
                {/* Loop through each resume and render a ResumeCard */}
                {resumes.map((resume) => (
                    <ResumeCard key={resume.id} resume={resume} />
                ))}
              </div>
          )}
      </section>
  </main>
}
