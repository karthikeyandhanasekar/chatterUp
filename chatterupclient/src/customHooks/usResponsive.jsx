import { useState, useEffect } from "react";

const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to update the state based on window width
    const handleResize = () => {
      // Here, 768px is considered the breakpoint for mobile view
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check on component mount
    handleResize();

    // Add event listener for resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
};

export default useResponsive;
