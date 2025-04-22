'use client'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { AiOutlineLoading } from 'react-icons/ai';

const page = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    if (message) {
        setTimeout(() => {
            setMessage('')
        }, 1500);
    }

    const searchMail = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/search-mail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            setLoading(false);
            setMessage(data.message);
            if (data.success) {
                router.push('/components/pass-verify');
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
                        <p className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-red-500 px-4 py-1 z-20 text-center text-white">
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


                <div className='px-10 py-12 space-y-5'>
                    <label htmlFor="email" className="block text-sm font-medium">
                        Email address
                    </label>
                    <div className="mt-1">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer focus:ring-indigo-500"
                        onClick={searchMail}>
                        Search
                    </button>
                </div>
            </div>
        </div>
    )
}

export default page