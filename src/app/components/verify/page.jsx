'use client'
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

const OTPVerification = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '',]);
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const inputRefs = useRef([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    if (message) {
        setTimeout(() => {
            setMessage('')
        }, 1500);
    }

    // Handle OTP input change
    const handleChange = (index, value) => {
        if (/^\d*$/.test(value) && value.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Auto-focus to next input
            if (value && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    // Handle backspace
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    // Countdown timer
    useEffect(() => {
        const timer = timeLeft > 0 && setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        if (timeLeft === 0) {
            setIsResendDisabled(false);
        }

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Format time (mm:ss)
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Resend OTP
    const handleResend = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/verify-mail/resend', { method: 'GET' });
            const data = await response.json();
            setLoading(false);
            setMessage(data.message);
            if (data.success) {
                setTimeLeft(120);
                setIsResendDisabled(true);
                setOtp(['', '', '', '', '', '',]);
                inputRefs.current[0].focus();
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Verify OTP
    const handleVerify = async (e) => {
        setLoading(true);
        e.preventDefault();
        const enteredOtp = otp.join('');
        try {
            const response = await fetch('/api/verify-mail/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp: enteredOtp.toString() })
            });
            const data = await response.json();
            setLoading(false);
            setMessage(data.message);
            if (data.success) {
                window.location.reload()
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="h-screen flex flex-col items-center py-12 sm:px-6 lg:px-8 text-[#d31158]">
            <div className="max-sm:mx-auto sm:w-full">
                <h2 className="mt-6 text-center text-3xl font-extrabold">
                    OTP Verification
                </h2>
                <p className="mt-2 text-center text-sm">
                    We've sent a 6-digit code to your email
                </p>
            </div>

            <div className={`mt-8 max-sm:mx-auto w-[370px] max-sm:w-[330px] bg-[#420a1f] ${loading ? 'pointer-events-none' : 'pointer-events-auto'}`}>
                <div className="bg-transparent backdrop-blur-xl py-8 px-4 shadow sm:rounded-lg sm:px-10 relative">

                    {
                        message && (
                            <p className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-red-500 px-4 py-1 z-20 text-white text-center">
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

                    <form className="space-y-6" onSubmit={handleVerify}>
                        <div>
                            <div className="flex justify-between space-x-4">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        className="w-full h-12 max-sm:h-10 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                {timeLeft > 0 ? (
                                    <span className="text-gray-100">
                                        Resend OTP in {formatTime(timeLeft)}
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                        Resend OTP
                                    </button>
                                )}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Verify OTP
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OTPVerification;