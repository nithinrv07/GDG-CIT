/**
 * App Component - Root application component
 */
import { SiteProvider } from './core/context/SiteContext';
import { AppRouter } from './core/router/AppRouter';
import { GDGCursor } from './cursor/GDGCursor';
import './styles/globals.css';

function App() {
    return (
        <SiteProvider>
            <GDGCursor />
            <AppRouter />
        </SiteProvider>
    );
}

export default App;
