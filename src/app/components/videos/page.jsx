'use client'
import { MdDeleteForever } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { IoMdSend } from "react-icons/io";
import { FaComment } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import Link from 'next/link';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { format } from 'timeago.js';
import { UserContext } from "@/app/Provider";

const page = () => {
    const myData = useContext(UserContext);
    const [render, setRender] = useState(0);
    const [user, setUser] = useState('');
    const [postId, setPostId] = useState('');
    const [comment, setComment] = useState(false);
    const [value, setValue] = useState("");
    const textareaRef = useRef(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto"; // Reset height
            const newHeight = Math.min(textarea.scrollHeight, 100); // Max height 100px
            textarea.style.height = newHeight + "px";
        }
    }, [value]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/user/user-image', { method: 'GET' });
                const data = await res.json();
                if (data.success) {
                    setUser(data.message);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [render]);

    const handleLike = async (userId) => {
        const audio = new Audio('/1.mp3');
        audio.play();
        try {
            const response = await fetch('/api/user/liked', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ myName: myData?.username, username: userId.username, userId: userId._id, postId: userId.post_id })
            });
            const data = await response.json();
            if (data.success) {
                setRender((prev) => prev + 1);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleComment = async (userId) => {
        const audio = new Audio('/2.mp3');
        audio.play();
        try {
            const response = await fetch('/api/user/comment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ myName: myData?.username, image: myData?.image, username: userId.username, userId: userId._id, postId: userId.post_id, comment: value })
            });
            const data = await response.json();
            if (data.success) {
                setRender((prev) => prev + 1);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleDelComment = async (comment, postId, username) => {
        try {
            const response = await fetch('/api/user/delete-comment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ comment, postId, username })
            });
            const data = await response.json();
            if (data.success) {
                setRender((prev) => prev + 1);
            }
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className='w-full flex flex-col items-center px-20 max-sm:px-5 max-sm:gap-5 mt-5 pb-10 scroll-smooth'>
            <div className="w-full relative grid grid-cols-4 gap-8 max-sm:grid-cols-1 max-sm:gap-0 max-sm:gap-y-7 z-10 scroll-smooth">
                {
                    user && user.filter((type) => type.format === 'mp4').slice().reverse().map((elem) => {
                        return (
                            <div className="flex flex-col p-4 gap-y-3 max-sm:p-0" key={elem._id}>
                                <div className='flex items-center gap-x-3 border-b border-b-[#d31142] pb-2'>
                                    <img src={elem.userImage ? elem.userImage : '/no-image-icon-4.png'} className='size-10 rounded-full object-cover object-center' />
                                    <div className='flex flex-col items-start justify-center'>
                                        <Link href={`/components/user/${elem.username}`}><p>{elem.username}</p></Link>
                                        <p className='text-xs -mt-px ml-1'>{format(elem.updatedAt)}</p>
                                    </div>
                                </div>
                                <p className='whitespace-pre-wrap leading-relaxed'>{elem.text}</p>
                                <div className='w-full h-auto relative z-10' >

                                    {
                                        (postId === elem.post_id && comment) && (
                                            <div className="absolute w-full flex flex-col items-center h-full px-2 py-5 bg-white text-[#d31142] z-20">

                                                <div className={`w-full h-full flex flex-col mt-2 overflow-y-scroll gap-y-3 ${myData ? 'pb-10' : 'pb-0'}`}>
                                                    {
                                                        elem.comment.slice().reverse().map((comment, index) => {
                                                            return (
                                                                <div className="w-full h-auto flex items-start justify-start gap-x-3" key={index}>
                                                                    <img src={comment.user_image ? comment.user_image : '/no-image-icon-4.png'} className='size-10 rounded-full object-cover object-center' />
                                                                    <div className='flex flex-1 flex-col gap-y-2 -mt-0.5'>
                                                                        <div className='w-full flex flex-col border-b border-b-[#d31142] pb-1 relative'>
                                                                            <Link href={`/components/user/${comment.username}`}><p>{comment.username}</p></Link>
                                                                            <p className='text-xs -mt-0.5'>{format(comment.createdAt)}</p>

                                                                            {
                                                                                comment.username === myData?.username && (
                                                                                    <button className="absolute right-5 text-2xl top-2" onClick={() => {
                                                                                        handleDelComment(comment.comment, elem.post_id, elem.username);
                                                                                    }}>
                                                                                        <MdDeleteForever />
                                                                                    </button>
                                                                                )
                                                                            }
                                                                        </div>
                                                                        <p className='whitespace-pre-wrap leading-relaxed'>{comment.comment}</p>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>

                                                <button className="absolute top-2 right-2 text-xl cursor-pointer" onClick={() => {
                                                    setPostId('');
                                                    setComment(false);
                                                }}><RxCross2 /></button>
                                                {
                                                    myData && (
                                                        <div className="absolute w-full bottom-3 flex items-center justify-between gap-x-1 px-3 bg-white z-10">
                                                            <textarea
                                                                ref={textareaRef}
                                                                rows={1}
                                                                className="w-full border rounded p-2 resize-none outline-none overflow-hidden"
                                                                placeholder="write here...."
                                                                value={value}
                                                                onChange={(e) => setValue(e.target.value)}
                                                            />
                                                            <button className="text-2xl cursor-pointer" onClick={() => {
                                                                handleComment(elem);
                                                                setValue('');
                                                            }}><IoMdSend /></button>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        )
                                    }

                                    <div className={`absolute flex flex-col gap-y-3 right-3 ${elem.format === 'mp4' ? 'bottom-28 z-10' : 'bottom-5'}`}>
                                        <div className={`${elem.liked.includes(myData?.username) || postId === elem.post_id ? 'text-[#d31142] pointer-events-none' : 'text-[rgba(255,0,0,0.5)] pointer-events-auto hover:scale-110 hover:text-[#d31142]'} text-4xl cursor-pointer relative flex items-center justify-center flex-col gap-y-1 transition-all duration-300`} onClick={() => {
                                            setPostId(elem.post_id);
                                            handleLike(elem);
                                        }}>
                                            <FaHeart />
                                            <p className="text-white text-lg">{elem.liked.length}</p>
                                        </div>
                                        <div className="text-4xl text-[#d31142] cursor-pointer relative flex items-center justify-center flex-col gap-y-1 " onClick={() => {
                                            setPostId(elem.post_id);
                                            setComment(true);
                                        }}>
                                            <FaComment />
                                            <p className="text-white text-lg">{elem.comment.length}</p>
                                        </div>
                                    </div>
                                    <video controls className='w-full'>
                                        <source src={elem.img_url} type='video/mp4' />
                                    </video>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            {!user && (
                <div className='w-full h-screen flex items-center justify-center z-20'>
                    <img src="/197-1970959_whf-logo-spinner-to-indicate-loading-transparent-loading-heart-gif.png" alt="" className='size-36 object-center object-cover' />
                </div>
            )}
        </div>
    )
}

export default page