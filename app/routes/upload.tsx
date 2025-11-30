// Import React hooks and types we need
import { useState, type FormEvent} from 'react'
// Import custom components we built elsewhere
import FileUploader from '~/componants/FileUploader';
import Navbar from '~/componants/Navbar'

// This is our main component for the upload page
const upload = () => {
    // useState lets us keep track of values that can change
    const [isProcessing, setIsProcessing] = useState(false); // true/false if resume is being analyzed
    const [statusText, setStatusText] = useState(''); // text message to show while processing
    const [file, setFile] = useState<File | null >(null); // the uploaded file (or null if none yet)

    // This function runs when a file is selected in FileUploader
    const handleFileSelect = (file: File | null) => {
        setFile(file) // save the file into our state
    };

    // This function runs when the form is submitted
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // stop the page from refreshing
        const form = e.currentTarget.closest('form'); // find the form element
        if(!form) return; // if no form found, stop

        // Collect all the form data (company name, job title, etc.)
        const formData = new FormData(form);
        const companyName = formData.get('company-name');
        const jobTitle = formData.get('job-title');
        const jobDescription = formData.get('job-description');

        // For now, just log everything to the console
        console.log({companyName, jobTitle, jobDescription, file});
    }

  // What the component shows on the screen
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      {/* Navbar at the top */}
      <Navbar />

      <section className="main-section">
        <div className='page-heading py-16'>
            <h1>Smart feedback for your dreem job</h1>

            {/* If we are processing, show loading text + animation */}
            {isProcessing ? (
                <>
                    <h2>{statusText}</h2>
                    <img src="/images/resume-scan.gif" className='w-full' />
                </>
            ) : (
                // Otherwise show instructions
                <h2>Drop your resume for an ATS score and imporovement tips</h2>
            )}

            {/* Only show the form if we are NOT processing */}
            {!isProcessing && (
                <form id='upload-form' onSubmit={handleSubmit} className='flex flex-col gap-4 mt-8'>

                    {/* Input for company name */}
                    <div className='form-div'>
                        <label htmlFor="company-name">Company Name</label>
                        <input type="text" name='company-name' placeholder='Company Name' id='company-name'  />
                    </div>

                    {/* Input for job title */}
                    <div className='form-div'>
                        <label htmlFor="job-title">Job Title</label>
                        <input type="text" name='job-title' placeholder='Job Title' id='job-title'  />
                    </div>

                    {/* Text area for job description */}
                    <div className='form-div'>
                        <label htmlFor="job-description">Job Title</label>
                        <textarea rows={5} name='job-description' placeholder='Job Description' id='job-description'  />
                    </div>

                    {/* File uploader component for resume */}
                    <div className='form-div'>
                        <label htmlFor="uploader">Upload Resume</label>
                        <FileUploader onFileSelect={handleFileSelect}/>
                    </div>

                    {/* Submit button */}
                    <button className='primary-button' type='submit'>Analyze Resume</button>
                </form>
            )}
        </div>
      </section>
    </main>
  )
}

// Export this component so it can be used in other parts of the app
export default upload
