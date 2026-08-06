/**
 * App Router - React Router configuration with lazy loading
 */
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { EventPopupModal } from '../../components/common/EventPopupModal';
import { ProtectedRoute } from '../../components/admin/ProtectedRoute';
import { ROLES } from '../context/AuthContext';

// Lazy load pages for code splitting
const Home = lazy(() => import('../../pages/Home'));
const Events = lazy(() => import('../../pages/Events'));
const Gallery = lazy(() => import('../../pages/Gallery'));
const Activities = lazy(() => import('../../pages/Activities'));
const Team = lazy(() => import('../../pages/Team'));
const Contact = lazy(() => import('../../pages/Contact'));
const Join = lazy(() => import('../../pages/Join'));

// Admin pages
const Login = lazy(() => import('../../pages/admin/Login'));
const AdminLayout = lazy(() => import('../../pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('../../pages/admin/AdminDashboard'));
const ManageEvents = lazy(() => import('../../pages/admin/ManageEvents'));
const ManageTeam = lazy(() => import('../../pages/admin/ManageTeam'));
const ManageSiteInfo = lazy(() => import('../../pages/admin/ManageSiteInfo'));
const ManageContact = lazy(() => import('../../pages/admin/ManageContact'));

// Loading component
const PageLoader = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black font-sans">
        <div className="w-14 h-14 relative mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-gray-100 border-t-[#4285F4] border-r-[#EA4335] border-b-[#FBBC04] border-l-[#34A853] animate-spin"></div>
        </div>
        <span className="font-black text-sm uppercase tracking-widest text-black">GDG CIT</span>
    </div>
);

export const AppRouter = () => {
    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <EventPopupModal />
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/activities" element={<Activities />} />
                    <Route path="/team" element={<Team />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/join" element={<Join />} />

                    {/* Admin Login Route */}
                    <Route path="/admin/login" element={<Login />} />

                    {/* Admin Dashboard Protected Routes */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.EVENTS_TEAM]}>
                                <AdminLayout />
                            </ProtectedRoute>
                        }
                    >
                        {/* Shared Admin Dashboard Home */}
                        <Route index element={<AdminDashboard />} />

                        {/* Events & Images Management (Super Admin & Events Team) */}
                        <Route
                            path="events"
                            element={
                                <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.EVENTS_TEAM]}>
                                    <ManageEvents />
                                </ProtectedRoute>
                            }
                        />

                        {/* Core Team Management (Super Admin Exclusive) */}
                        <Route
                            path="team"
                            element={
                                <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                                    <ManageTeam />
                                </ProtectedRoute>
                            }
                        />

                        {/* Mission, Vision & Site Text (Super Admin Exclusive) */}
                        <Route
                            path="site-info"
                            element={
                                <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                                    <ManageSiteInfo />
                                </ProtectedRoute>
                            }
                        />

                        {/* Contact Details & Socials (Super Admin Exclusive) */}
                        <Route
                            path="contact"
                            element={
                                <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                                    <ManageContact />
                                </ProtectedRoute>
                            }
                        />
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};

