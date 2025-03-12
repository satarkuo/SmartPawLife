import { useEffect, useState } from "react";

const useScreenSize = () => {
    const defaultScreenSize = {
        screenWidth: window.innerWidth,
        screenHeight:  window.innerHeight
    }
    const [screenSize, setScreenSize] = useState(defaultScreenSize);
    
    useEffect(() => {
        const handleResize = () => {
            setScreenSize({
                screenWidth:  window.innerWidth,
                screenHeight:  window.innerHeight
            })
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    },[])

    return screenSize;
}

export default useScreenSize;