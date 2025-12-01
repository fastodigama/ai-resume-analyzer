// Import React
import React, {useEffect, useState} from 'react';
// Import Link from React Router (used for navigation without page reloads)
import {Link} from "react-router";
// Import a custom component that shows a circular score visualization
import ScoreCircle from "~/componants/ScoreCircle";
// (This import of resume from react-dom/server looks unused and may not be needed, 
// but I will not remove it since you asked not to alter code)
import {resume} from "react-dom/server";
import { usePuterStore } from '~/lib/puter';

// ResumeCard component
// It receives a "resume" object as a prop and pulls out its fields
const ResumeCard = ({resume: {id,companyName,jobTitle,feedback,imagePath} }:{resume: Resume }) => {
    const {  fs } = usePuterStore();
     const [resumeUrl, setResumeUrl] = useState('');

        useEffect(() => {
          const loadResume = async () => {
            const blob = await fs.read(imagePath);
            if(!blob) return;
    
            let url = URL.createObjectURL(blob) ;
            setResumeUrl(url);
          }
          loadResume();
        },[imagePath])

    return (
        // Wrap the whole card in a Link so clicking it navigates to /resume/{id}
        <Link to={`/resume/${id}`} className={"resume-card animate-in fade-in duration-1000"}>
            
            {/* Header section of the card */}
            <div className="resume-card-header">
                {/* Company name and job title */}
                <div className="flex flex-col gap-2">
                   {companyName &&  <h2 className={"!text-black font-bold break-words"}>{companyName}</h2>}
                    {jobTitle && <h3 className={"text-lg break-words text-gray-500"}>{jobTitle}</h3>}
                    {!companyName && !jobTitle && <h2 className='!text-black font-bold'>Resume</h2>}
                    </div>

                {/* Score circle showing overall feedback score */}
                <div className="flex-shrink-0">
                    <ScoreCircle score={feedback.overallScore} />
                </div>
            </div>

            {/* Image section of the card */}
            {resumeUrl && ( <div className="gradient-border animate-in fade-in duration-1000">
                <div className="w-full h-full">
                    {/* Show the resume image */}
                    <img src={resumeUrl}
                         alt={resume.name} // alt text for accessibility
                         className={"w-full h-[350px] max-sm:h-[200px] object-cover object-top"}
                    />
                </div>
            </div>
            )}
        </Link>
    );
};

// Export the component so it can be used elsewhere
export default ResumeCard;
