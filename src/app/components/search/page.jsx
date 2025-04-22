'use client'
import React, { useState } from 'react'

const page = () => {
    const [loading, setLoading] = useState(false);
    
    return (
        <div className="flex flex-col items-center py-12 sm:px-6 lg:px-8 text-[#d31158]">
            <div className="w-80 h-96 rounded-md bg-white flex items-center justify-between">
                <input type="text" />
                <button></button>
            </div>
        </div>
    )
}

export default page