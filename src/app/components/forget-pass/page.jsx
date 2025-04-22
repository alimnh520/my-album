'use client'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { AiOutlineLoading } from 'react-icons/ai';
import { PiEyeBold, PiEyeClosedBold } from 'react-icons/pi';

const page = () => {
    const [eye, setEye] = useState(false);
    const [eye2, setEye2] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();

    if (message) {
        setTimeout(() => {
            setMessage('')
        }, 1500);
    }

    const handleChange = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/forget-pass', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password, confirmPassword })
            });
            const data = await response.json();
            setLoading(false);
            setMessage(data.message);
            if (data.success) {
                router.push('/components/login');
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="h-screen flex flex-col items-center py-12 sm:px-6 lg:px-8 text-[#d31158] relative">

            <div className={`mt-8 max-sm:mx-auto w-[370px] max-sm:w-[330px] z-10 bg-[#3f061a] rounded-md text-white relative ${loading ? 'pointer-events-none' : 'pointer-events-auto'}`}>
                {
                    message && (
                        <p className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-red-500 px-4 py-1 z-20 text-center">
                            {message}
                        </p>
                    )
                }
                {
                    loading && (
                        <div className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 size-36 flex items-center justify-center rounded-full z-20'>
                            <img src="/197-1970959_whf-logo-spinner-to-indicate-loading-transparent-loading-heart-gif.png" alt="" className='w-full h-full object-center object-cover' />
                        </div>
                    )
                }

                <div className="bg-transparent py-8 px-4 shadow sm:rounded-lg sm:px-10 backdrop-blur-xl space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium">
                            Password
                        </label>
                        <div className="mt-1 relative flex items-center justify-center">
                            <input
                                id="password"
                                name="password"
                                type={eye ? 'text' : 'password'}
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <button className="absolute right-5 z-10 text-xl cursor-pointer" onClick={() => setEye(!eye)}>
                                {eye ? <PiEyeBold /> : <PiEyeClosedBold />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium">
                            Confirm Password
                        </label>
                        <div className="mt-1 relative flex items-center justify-center">
                            <input
                                id="password"
                                name="password"
                                type={eye2 ? 'text' : 'password'}
                                autoComplete="current-password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <button className="absolute right-5 z-10 text-xl cursor-pointer" onClick={() => setEye2(!eye2)}>
                                {eye2 ? <PiEyeBold /> : <PiEyeClosedBold />}
                            </button>
                        </div>
                    </div>
                    <button className='bg-blue-600 px-4 py-2 relative left-1/2 -translate-x-1/2 cursor-pointer' onClick={handleChange}>Submit</button>
                </div>
            </div>
        </div>
    )
}

export default page