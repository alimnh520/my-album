'use client'
import { PiEyeBold } from "react-icons/pi";
import { PiEyeClosedBold } from "react-icons/pi";
import { useState } from 'react';
import Link from 'next/link';
import { AiOutlineLoading } from "react-icons/ai";
import { useRouter } from 'next/navigation';
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";


const LoginForm = () => {
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [eye, setEye] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    if (message) {
        setTimeout(() => {
            setMessage('')
        }, 1500);
    }

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            const response = await fetch("/api/signup", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            const data = await response.json();
            setLoading(false);
            setMessage(data.message);
            if (data.success) {
                router.push('/components/verify');
            }
        } catch (error) {
            console.log(error);
        }
        setUserName('');
        setEmail('');
        setPassword('');
    };
    const handleSignIn = async () => {
        setLoading(true);
        const res = await signIn("google", {
            redirect: false,
            callbackUrl: "/components/dashboard"
        });
    };

    return (
        <div className="flex flex-col items-center py-12 sm:px-6 lg:px-8 relative">

            <div className="max-sm:mx-auto sm:w-full">
                <h2 className="text-center text-3xl font-extrabold">
                    Create your account
                </h2>
            </div>

            <div className={`mt-8 max-sm:mx-auto w-[370px] max-sm:w-[330px] z-10 bg-[#440420] rounded-md text-white relative ${loading ? 'pointer-events-none' : 'pointer-events-auto'}`}>

                {
                    message && (
                        <p className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-red-500 px-4 py-1 z-20">
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

                <div className="bg-transparent py-8 px-4 shadow sm:rounded-lg sm:px-10 backdrop-blur-xl">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium">
                                Your Style Name
                            </label>
                            <div className="mt-1">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    value={username}
                                    onChange={(e) => setUserName(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
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
                        </div>

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

                        <div className="flex items-center justify-end">
                            <Link href="/components/login" className='text-blue-600 cursor-pointer'>login</Link>
                        </div>

                        <div className="flex flex-col gap-y-3">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer focus:ring-indigo-500"
                                onClick={handleSubmit}>
                                Sign up
                            </button>
                            <div className="w-full flex items-center justify-center gap-x-3">
                                <div className="w-1/2 h-px bg-white"></div>
                                <p>or</p>
                                <div className="w-1/2 h-px bg-white"></div>
                            </div>
                            <div className="w-full flex items-center justify-center gap-x-3">
                                <button
                                    onClick={handleSignIn}
                                    className="bg-white w-1/2 text-3xl flex items-center justify-center py-2 rounded cursor-pointer"
                                >
                                    <FcGoogle />
                                </button>

                                <button
                                    onClick={handleSignIn}
                                    className="bg-white text-blue-700 w-1/2 text-3xl flex items-center justify-center py-2 rounded cursor-pointer"
                                >
                                    <FaFacebookF />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;