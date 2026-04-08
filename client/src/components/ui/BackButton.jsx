import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import React from 'react'

const BackButton = () => {
    const navigate = useNavigate();
  return (
    <div>
      <button
          onClick={() => navigate(-1)}
          className="vn-back-btn flex items-center gap-2 mb-6 font-mono text-[16px] tracking-widest uppercase opacity-40 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer"
        >
          <FiArrowLeft size={12} /> Back
        </button>
    </div>
  )
}

export default BackButton
