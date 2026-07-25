import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '../../core/hooks/useContent';

export const EventPopupModal = ({ eventData }) => {
    const { data: events } = useContent('events');

    // Default fallback event data based on poster
    const defaultEvent = {
        title: "Build Your AI-Powered Second Brain",
        posterImage: "/images/second-brain-poster.jpg",
        registerUrl: "https://docs.google.com/forms/d/e/1FAIpQLSe2IRWJSKKbwfC7HMhGtljivXVGEQFqAWDQA3LGGI1QSeaL1w/viewform"
    };

    // Find featured event or fallback to default
    const upcomingEventFromData = events && events.length > 0 ? (events.find(e => e.featured) || events[0]) : null;

    const event = eventData || (upcomingEventFromData ? {
        title: upcomingEventFromData.title || defaultEvent.title,
        posterImage: upcomingEventFromData.posterImage || defaultEvent.posterImage,
        registerUrl: upcomingEventFromData.registerUrl || defaultEvent.registerUrl
    } : defaultEvent);

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Show modal automatically on site load after brief delay
        const timer = setTimeout(() => {
            const hasSeen = sessionStorage.getItem('gdg_event_popup_seen');
            if (!hasSeen) {
                setIsOpen(true);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        sessionStorage.setItem('gdg_event_popup_seen', 'true');
    };

    const handleOpen = () => {
        setIsOpen(true);
    };

    // Keyboard support (Escape key to close modal)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    return (
        <>
            {/* Pure Poster Pop-up Modal */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-6 overflow-hidden">
                        
                        {/* Backdrop Blur & Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleClose}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
                        />

                        {/* Poster Modal Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="relative max-w-xl sm:max-w-2xl w-full max-h-[92vh] flex flex-col items-center justify-center z-10 my-auto"
                        >
                            {/* Floating Close Button (Top-Right of Poster) */}
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleClose}
                                aria-label="Close popup"
                                className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-[#EA4335] text-white border-[2.5px] border-black rounded-full w-9 h-9 sm:w-10 sm:h-10 font-black text-base shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center z-30 cursor-pointer"
                            >
                                ✕
                            </motion.button>

                            {/* Main Poster Image */}
                            <a
                                href={event.registerUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex justify-center cursor-pointer group"
                            >
                                <img
                                    src={event.posterImage}
                                    alt={event.title}
                                    className="w-auto max-w-full max-h-[80vh] sm:max-h-[83vh] object-contain rounded-2xl shadow-2xl border-[3px] border-black transition-transform duration-300 group-hover:scale-[1.01]"
                                />
                            </a>

                            {/* Action Buttons Below Poster */}
                            <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-3 z-20">
                                <motion.a
                                    href={event.registerUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-[#34A853] hover:bg-[#2e9648] text-white border-[3px] border-black rounded-full py-2.5 px-7 font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                >
                                    Register Now
                                </motion.a>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleClose}
                                    className="bg-white hover:bg-gray-100 text-black border-[3px] border-black rounded-full py-2.5 px-5 font-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                                >
                                    Close
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Persistent Floating Widget to reopen poster if closed */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleOpen}
                    className="fixed bottom-6 right-6 z-40 bg-[#FBBC04] text-black border-[3px] border-black rounded-full px-4 py-2.5 font-black text-xs sm:text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 cursor-pointer"
                >
                    <span>Upcoming Event</span>
                </motion.button>
            )}
        </>
    );
};
