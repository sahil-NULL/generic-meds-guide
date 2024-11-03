import React from "react";
import { useNavigate } from "react-router-dom"

function MethodSelector() {
  const navigate = useNavigate()
  
  const handleClick = (e) => {
    navigate(`/${e.target.name}`)
  } 
  
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      
      <button 
        className="bg-white w-1/2 h-12 max-w-80 m-6 text-black text-2xl font-semibold text-center rounded-full hover:bg-black hover:text-white transition-all duration-500 ease-in-out"
        name="name"
        type="button"
        onClick={handleClick}
      >
        Name
      </button>
      

      <button 
        className="bg-white w-1/2 h-12 max-w-80 text-black text-2xl font-semibold text-center rounded-full hover:bg-black hover:text-white transition-all duration-500 ease-in-out"
        name="composition"
        onClick={handleClick}
      >
        Composition
      </button>
    </div>
  );
}

export default MethodSelector;
