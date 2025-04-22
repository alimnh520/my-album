'use client'
import React, { createContext, useEffect, useRef, useState } from 'react'
import Header from './layout/Header'

export const UserContext = createContext();

const Provider = ({ children }) => {
    const mainDiv = useRef();
    const [data, setData] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/user/my-data', {
                    method: 'GET'
                });
                const data = await res.json();
                if (data.success) {
                    setData(data.message);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, []);
    useEffect(() => {
        if (mainDiv.current) {
            for (let i = 0; i < 15; i++) {
                const newDiv = document.createElement('span');
                newDiv.classList.add('love');
                mainDiv.current.appendChild(newDiv);

                const randomSize = Math.random() * 20 + 10;

                newDiv.style.height = randomSize + 'px';
                newDiv.style.width = randomSize + 'px';

                newDiv.style.setProperty('--before-top', randomSize / 2 + 'px');
                newDiv.style.setProperty('--after-left', randomSize / 2 + 'px');

                const delayTime = Math.random() * 6 + 5;
                const durationTime = Math.random() * 6 + 4;
                newDiv.style.animationDelay = delayTime + 's';
                newDiv.style.animationDuration = durationTime + 's';

                const move = Math.random() * window.innerWidth + 0;
                newDiv.style.left = move + 'px';
            }
        }
    }, []);

    return (
        <UserContext.Provider value={data} className='w-full overflow-x-hidden relative scroll-smooth'>
            <Header />
            {children}
        </UserContext.Provider>
    )
}

export default Provider