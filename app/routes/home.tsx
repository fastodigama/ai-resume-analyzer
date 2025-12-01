// Import the type for route metadata (helps with typing in Remix/React Router)
import type { Route } from "./+types/home";

// Import our Navbar component
import Navbar from "~/componants/Navbar";



// Import a card component that displays each resume
import ResumeCard from "~/componants/ResumeCard";

// Import our custom store hook (likely handles authentication and app state)
import {usePuterStore} from "~/lib/puter";

// Import navigation helpers from React Router
import { Link, useNavigate} from "react-router";

// Import React's useEffect hook
import {useEffect, useState} from "react";


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
    const {  auth, kv } = usePuterStore();


    // Hook to programmatically navigate between pages
    const navigate = useNavigate();

    const [resumes, setResumes] = useState<Resume[]>([]);

    const [loadingResumes, setLoadingResumes] = useState(false);

    // useEffect runs after the component renders
    // Here: if the user is NOT authenticated, redirect them to the /auth page
    useEffect(() => {
        if(!auth.isAuthenticated) navigate('/auth?next=/');
    }, [auth.isAuthenticated]); // runs whenever auth.isAuthenticated changes

    useEffect(() => {
      const loadResumes = async () => {
        setLoadingResumes(true);
        const resumes= (await kv.list('resume:*', true)) as KVItem[];

        const parsedResumes =  resumes?.map((resume) => (
          JSON.parse(resume.value) as Resume
        ))
        console.log('parsedResumes',parsedResumes)
        setResumes(parsedResumes || []);
        setLoadingResumes(false);
      }

      loadResumes();

    },[]);



  // What the page shows on screen
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    {/* Navbar at the top */}
    <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
            {/* Page heading */}
            <h1>Track Your Application & Resume Ratings</h1>
            {!loadingResumes && resumes.length === 0 ? (
                <h2>No resumes found. Upload your first resume to get feedback</h2>
            ):(
              <h2>Review your submissions and check AI-powered feedback.</h2>
            ) }
            
        </div>
        {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" />
          </div>
        )}

          {/* Only show resumes if we have at least one */}
          {!loadingResumes && resumes.length > 0 && (
              <div className={"resumes-section"}>
                {/* Loop through each resume and render a ResumeCard */}
                {resumes.map((resume) => (
                    <ResumeCard key={resume.id} resume={resume} />
                ))}
              </div>
          )}

          {!loadingResumes && resumes?.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-10 gap-4">
              <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
                Upload Resume
              </Link>
            </div>
          )}
      </section>
  </main>
}
