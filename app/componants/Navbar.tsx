// Import the Link component from React Router
// Link is used instead of <a> tags so navigation works without reloading the page
import {Link} from "react-router";

// Define the Navbar component
const Navbar = () => {
    return (
        // The main navigation bar container
        <nav className={"navbar"}>
            
            {/* Logo / Home link */}
            {/* Clicking this takes the user back to the homepage ("/") */}
            <Link to={"/"}>
                <p className={"text-2xl font-bold text-gradient"}>
                    RESUMIND
                </p>
            </Link>

            {/* Upload Resume button */}
            {/* Clicking this takes the user to the upload page ("/upload") */}
            <Link to={"/upload"} className={"primary-button w-fit"}>
                Upload Resume
            </Link>
        </nav>
    );
};

// Export the Navbar so it can be used in other components/pages
export default Navbar;
