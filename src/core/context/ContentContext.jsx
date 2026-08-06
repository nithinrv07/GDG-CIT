import { createContext, useContext, useState, useEffect } from 'react';

const ContentContext = createContext();

export const useContentContext = () => {
    const context = useContext(ContentContext);
    if (!context) {
        throw new Error('useContentContext must be used within a ContentProvider');
    }
    return context;
};

export const ContentProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [team, setTeam] = useState([]);
    const [siteData, setSiteData] = useState(null);
    const [contact, setContact] = useState(null);
    const [activities, setActivities] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial load from localStorage or static content files
    useEffect(() => {
        const loadAllContent = async () => {
            try {
                // 1. Events
                const localEvents = localStorage.getItem('gdg_events');
                if (localEvents) {
                    setEvents(JSON.parse(localEvents));
                } else {
                    const res = await fetch('/content/events.json');
                    const data = await res.json();
                    setEvents(data);
                }

                // 2. Team
                const localTeam = localStorage.getItem('gdg_team');
                if (localTeam) {
                    setTeam(JSON.parse(localTeam));
                } else {
                    const res = await fetch('/content/team.json');
                    const data = await res.json();
                    setTeam(data);
                }

                // 3. Site Data (Hero, About, Mission, Vision, Footer)
                const localSite = localStorage.getItem('gdg_site');
                if (localSite) {
                    setSiteData(JSON.parse(localSite));
                } else {
                    const res = await fetch('/content/site.json');
                    const data = await res.json();
                    setSiteData(data);
                }

                // 4. Contact & Socials
                const localContact = localStorage.getItem('gdg_contact');
                if (localContact) {
                    setContact(JSON.parse(localContact));
                } else {
                    const [socialRes, settingsRes] = await Promise.all([
                        fetch('/content/social.json'),
                        fetch('/content/settings.json')
                    ]);
                    const socialData = await socialRes.json();
                    const settingsData = await settingsRes.json();
                    const mergedContact = {
                        email: settingsData.contactEmail || 'gdg@citchennai.net',
                        phone: '+91 98765 43210',
                        address: 'Chennai Institute of Technology, Sarathy Nagar, Kundrathur, Chennai, Tamil Nadu 600069',
                        mapUrl: 'https://maps.google.com/?q=Chennai+Institute+of+Technology',
                        socials: socialData
                    };
                    setContact(mergedContact);
                }

                // 5. Activities
                const localActivities = localStorage.getItem('gdg_activities');
                if (localActivities) {
                    setActivities(JSON.parse(localActivities));
                } else {
                    const res = await fetch('/content/activities.json');
                    const data = await res.json();
                    setActivities(data);
                }

                // 6. Gallery
                const localGallery = localStorage.getItem('gdg_gallery');
                if (localGallery) {
                    setGallery(JSON.parse(localGallery));
                } else {
                    const res = await fetch('/content/gallery.json');
                    const data = await res.json();
                    setGallery(data);
                }
            } catch (err) {
                console.error('Error loading content in ContentProvider:', err);
            } finally {
                setLoading(false);
            }
        };

        loadAllContent();
    }, []);

    // Events Operations (Super Admin & Events Team)
    const updateEvents = (newEvents) => {
        setEvents(newEvents);
        localStorage.setItem('gdg_events', JSON.stringify(newEvents));
    };

    const addEvent = (newEvent) => {
        const updated = [newEvent, ...events];
        updateEvents(updated);
    };

    const editEvent = (id, updatedFields) => {
        const updated = events.map(ev => ev.id === id ? { ...ev, ...updatedFields } : ev);
        updateEvents(updated);
    };

    const deleteEvent = (id) => {
        const updated = events.filter(ev => ev.id !== id);
        updateEvents(updated);
    };

    // Team Operations (Super Admin Exclusive)
    const updateTeam = (newTeam) => {
        setTeam(newTeam);
        localStorage.setItem('gdg_team', JSON.stringify(newTeam));
    };

    const addTeamMember = (member) => {
        const updated = [...team, member];
        updateTeam(updated);
    };

    const editTeamMember = (id, updatedFields) => {
        const updated = team.map(m => m.id === id ? { ...m, ...updatedFields } : m);
        updateTeam(updated);
    };

    const deleteTeamMember = (id) => {
        const updated = team.filter(m => m.id !== id);
        updateTeam(updated);
    };

    // Site Data Operations (Super Admin Exclusive)
    const updateSiteData = (newSiteData) => {
        setSiteData(newSiteData);
        localStorage.setItem('gdg_site', JSON.stringify(newSiteData));
    };

    // Contact Operations (Super Admin Exclusive)
    const updateContact = (newContact) => {
        setContact(newContact);
        localStorage.setItem('gdg_contact', JSON.stringify(newContact));
    };

    // Gallery Operations (Super Admin & Events Team)
    const updateGallery = (newGallery) => {
        setGallery(newGallery);
        localStorage.setItem('gdg_gallery', JSON.stringify(newGallery));
    };

    const addGalleryPhoto = (photoItem) => {
        const updated = [photoItem, ...gallery];
        updateGallery(updated);
    };

    const deleteGalleryPhoto = (id) => {
        const updated = gallery.filter(item => item.id !== id);
        updateGallery(updated);
    };

    // Reset to static JSON defaults
    const resetToDefaults = async () => {
        localStorage.removeItem('gdg_events');
        localStorage.removeItem('gdg_team');
        localStorage.removeItem('gdg_site');
        localStorage.removeItem('gdg_contact');
        localStorage.removeItem('gdg_activities');
        localStorage.removeItem('gdg_gallery');
        window.location.reload();
    };

    const value = {
        events,
        team,
        siteData,
        contact,
        activities,
        gallery,
        loading,
        updateEvents,
        addEvent,
        editEvent,
        deleteEvent,
        updateTeam,
        addTeamMember,
        editTeamMember,
        deleteTeamMember,
        updateSiteData,
        updateContact,
        updateGallery,
        addGalleryPhoto,
        deleteGalleryPhoto,
        resetToDefaults
    };

    return (
        <ContentContext.Provider value={value}>
            {children}
        </ContentContext.Provider>
    );
};
