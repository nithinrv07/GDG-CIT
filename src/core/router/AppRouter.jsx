/**
 * App Router - React Router configuration with lazy loading
 */
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { EventPopupModal } from '../../components/common/EventPopupModal';

// Lazy load pages for code splitting
const Home = lazy(() => import('../../pages/Home'));
const Events = lazy(() => import('../../pages/Events'));
const Gallery = lazy(() => import('../../pages/Gallery'));
const Activities = lazy(() => import('../../pages/Activities'));
const Team = lazy(() => import('../../pages/Team'));
const Contact = lazy(() => import('../../pages/Contact'));
const Join = lazy(() => import('../../pages/Join'));

// Loading component
const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gdgBlue"></div>
    </div>
);

export const AppRouter = () => {
    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <EventPopupModal />
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/activities" element={<Activities />} />
                    <Route path="/team" element={<Team />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/join" element={<Join />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};
