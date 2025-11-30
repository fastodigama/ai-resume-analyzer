// ScoreCircle component
// It shows a circular progress indicator for a score (default 75 out of 100)
const ScoreCircle = ({ score = 75 }: { score: number }) => {
    // Radius of the circle
    const radius = 40;
    // Thickness of the circle stroke
    const stroke = 8;
    // Adjusted radius so the stroke fits inside the SVG viewBox
    const normalizedRadius = radius - stroke / 2;
    // Circumference of the circle (used for stroke calculations)
    const circumference = 2 * Math.PI * normalizedRadius;
    // Convert score (0–100) into a percentage (0–1)
    const progress = score / 100;
    // Stroke offset determines how much of the circle is filled
    const strokeDashoffset = circumference * (1 - progress);

    return (
        // Outer container for the circle
        <div className="relative w-[100px] h-[100px]">
            {/* SVG element to draw the circle */}
            <svg
                height="100%"
                width="100%"
                viewBox="0 0 100 100"
                className="transform -rotate-90" // rotate so progress starts at the top
            >
                {/* Background circle (gray outline) */}
                <circle
                    cx="50" // center x
                    cy="50" // center y
                    r={normalizedRadius} // radius
                    stroke="#e5e7eb" // gray color
                    strokeWidth={stroke} // thickness
                    fill="transparent" // no fill
                />

                {/* Define gradient colors for the progress circle */}
                <defs>
                    <linearGradient id="grad" x1="1" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF97AD" />   {/* pink at start */}
                        <stop offset="100%" stopColor="#5171FF" /> {/* blue at end */}
                    </linearGradient>
                </defs>

                {/* Progress circle (colored arc) */}
                <circle
                    cx="50"
                    cy="50"
                    r={normalizedRadius}
                    stroke="url(#grad)" // use gradient defined above
                    strokeWidth={stroke}
                    fill="transparent"
                    strokeDasharray={circumference} // full circle length
                    strokeDashoffset={strokeDashoffset} // how much is hidden
                    strokeLinecap="round" // rounded ends
                />
            </svg>

            {/* Text in the center showing the score */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-semibold text-sm">{`${score}/100`}</span>
            </div>
        </div>
    );
};

// Export the component so it can be used elsewhere
export default ScoreCircle;
