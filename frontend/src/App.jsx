import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sandbox from './pages/Sandbox';
import GameWorld from './game/GameWorld';
import HostDashboard from './game/HostDashboard';
import Intro from './pages/Intro';
import Auth from './pages/Auth';
import VerifyEmail from './pages/VerifyEmail';
import useAppStore from './store/useAppStore';
import { AuthProvider, ProtectedRoute, useAuth } from './context/AuthContext';

// Data Structures
import ArrayHub from './visualizers/ds/ArrayHub';
import Array3DVisualizer from './visualizers/ds/Array3DVisualizer';
import StringHub from './visualizers/ds/StringHub';
import StringVisualizer from './visualizers/ds/StringVisualizer';
import StackHub from './visualizers/ds/StackHub';
import StackVisualizer from './visualizers/ds/StackVisualizer';
import QueueHub from './visualizers/ds/QueueHub';
import QueueVisualizer from './visualizers/ds/QueueVisualizer';
import LinkedListHub from './visualizers/ds/LinkedListHub';
import LinkedListVisualizer from './visualizers/ds/LinkedListVisualizer';
import TreeHub from './visualizers/ds/TreeHub';
import TreeGraphVisualizer from './visualizers/ds/TreeGraphVisualizer';
import GraphHub from './visualizers/ds/GraphHub';
import GraphVisualizer from './visualizers/ds/GraphVisualizer';
import HeapVisualizer from './visualizers/ds/HeapVisualizer';
import MapVisualizer from './visualizers/ds/MapVisualizer';

// OOP Studios & Layout
import OopLayout from './visualizers/oop/OopLayout';
import OopOverview from './visualizers/oop/OopOverview';
const EncapsulationVisualizer = React.lazy(() => import('./visualizers/oop/EncapsulationVisualizer'));
const AbstractionVisualizer = React.lazy(() => import('./visualizers/oop/AbstractionVisualizer'));
const InheritanceVisualizer = React.lazy(() => import('./visualizers/oop/InheritanceVisualizer'));
const SingleInheritanceVisualizer = React.lazy(() => import('./visualizers/oop/SingleInheritanceVisualizer'));
const MultilevelInheritanceVisualizer = React.lazy(() => import('./visualizers/oop/MultilevelInheritanceVisualizer'));
const PolymorphismVisualizer = React.lazy(() => import('./visualizers/oop/PolymorphismVisualizer'));
const InheritanceInPrepView = React.lazy(() => import('./visualizers/oop/inheritance/InheritanceInPrepView'));

// Cryptography Studio
import CryptoHub from './visualizers/crypto/CryptoHub';

const PrivateRoute = ({ children }) => {
  return <ProtectedRoute>{children}</ProtectedRoute>;
};

// Dispatcher for dynamic inheritance subtypes (/oop/inheritance/:type)
const OopInheritanceDispatcher = () => {
  const { type } = useParams();
  const navigate = useNavigate();

  if (type === 'single') {
    return (
      <SingleInheritanceVisualizer
        isEmbedded={true}
        onNext={() => navigate('/oop/inheritance/multilevel')}
      />
    );
  }

  if (type === 'multilevel') {
    return (
      <MultilevelInheritanceVisualizer
        isEmbedded={true}
        onNext={() => navigate('/oop/polymorphism')}
      />
    );
  }

  if (type === 'hierarchical') {
    return (
      <InheritanceVisualizer
        isEmbedded={true}
        onNext={() => navigate('/oop/polymorphism')}
      />
    );
  }

  return (
    <InheritanceInPrepView
      type={type}
      onSwitchType={(t) => navigate(`/oop/inheritance/${t}`)}
      onSwitchToHierarchical={() => navigate('/oop/inheritance/hierarchical')}
    />
  );
};

// Legacy redirect for visualizer inheritance routes
const LegacyInheritanceRedirect = () => {
  const { type } = useParams();
  return <Navigate to={type ? `/oop/inheritance/${type}` : '/oop/inheritance/hierarchical'} replace />;
};

// Visualizer redirect dispatcher: routes ?cat=crypto directly to /visualizer/crypto
const VisualizerRouteDispatcher = () => {
  const [searchParams] = useSearchParams();
  const cat = searchParams.get('cat') || searchParams.get('tab') || searchParams.get('view');
  if (cat === 'crypto' || cat === 'cryptography') {
    return <Navigate to="/visualizer/crypto" replace />;
  }
  return <Navigate to="/oop" replace />;
};

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const isIntro = location.pathname === '/' || location.pathname === '/intro' || location.pathname === '/home';
  const isVisualizerHub = location.pathname === '/visualizer' || location.pathname === '/visualization' || location.pathname === '/visualizations';
  const isAuth = location.pathname === '/auth';
  const isVerifyEmail = location.pathname === '/verify-email';
  const isFullscreen = isAuth || isVerifyEmail;

  const isCryptoRoute = location.pathname.startsWith('/visualizer/crypto') ||
    location.pathname.startsWith('/crypto') ||
    location.pathname.startsWith('/cryptography') ||
    ['caesar', 'vigenere', 'playfair', 'railfence', 'columnar', 'aes', 'rsa', 'hash', 'signature', 'steg', 'enigma', 'hacker', 'dh']
      .some(algo => location.pathname.includes(algo));

  const isAppStudio = isVisualizerHub || isCryptoRoute || location.pathname === '/sandbox' || location.pathname === '/game' || location.pathname === '/host';

  const isOopLanding = ['/oop', '/oop/', '/oops', '/oops/'].includes(location.pathname);
  const isOopConcept = !isOopLanding && !isCryptoRoute && (
    location.pathname.startsWith('/oop') ||
    location.pathname.startsWith('/oops') ||
    location.pathname.startsWith('/visualizer/oop') ||
    location.pathname.startsWith('/visualizer/encapsulation') ||
    location.pathname.startsWith('/visualizer/abstraction') ||
    location.pathname.startsWith('/visualizer/inheritance') ||
    location.pathname.startsWith('/visualizer/polymorphism')
  );
  const isOopRoute = isOopLanding || isOopConcept;

  const hideNavbar = isFullscreen || isOopConcept;
  const { theme } = useAppStore();

  React.useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    root.classList.remove('dark', 'warm');
    body.classList.remove('dark', 'warm');
    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else if (theme === 'warm') {
      root.classList.add('warm');
      body.classList.add('warm');
    }
  }, [theme]);

  const themeClass = theme === 'dark'
    ? (isOopRoute ? 'dark bg-[#0B0F17] text-[#FAF7F2]' : 'dark bg-[#331921] text-[#F4EBC3]')
    : theme === 'warm'
      ? (isOopRoute ? 'warm bg-[#FDFBF7] text-[#2D1F23]' : 'warm bg-[#F4EBC3] text-[#2D1F23]')
      : (isOopRoute ? 'bg-[#F8FAFC] text-slate-900' : 'bg-[#FAF7F2] text-[#2D1F23]');

  const mainClass = isFullscreen
    ? ''
    : isIntro
      ? 'relative'
      : isAppStudio
        ? 'h-[calc(100vh-64px)] overflow-hidden'
        : isOopConcept
          ? 'h-screen w-screen overflow-hidden flex flex-col'
          : isOopRoute
            ? 'h-[calc(100vh-64px)] overflow-hidden flex flex-col'
            : 'min-h-[calc(100vh-64px)] pb-16';

  return (
    <div className={isFullscreen ? '' : isOopConcept ? `h-screen w-screen overflow-hidden ${themeClass} font-sans transition-colors duration-300` : `min-h-screen ${themeClass} font-sans transition-colors duration-300`}>
      {!hideNavbar && <Navbar />}

      <main className={mainClass}>
        <Routes>
          {/* Root and Intro routes */}
          <Route path="/" element={<Intro />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/home" element={<Intro />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Protected Platform Experience - Requires Valid Authentication */}
          <Route element={<ProtectedRoute />}>
            {/* Legacy /visualizer Routes -> Redirected to /oop or /visualizer/crypto */}
            <Route path="/visualizer" element={<VisualizerRouteDispatcher />} />
            <Route path="/visualization" element={<VisualizerRouteDispatcher />} />
            <Route path="/visualizations" element={<VisualizerRouteDispatcher />} />

          {/* DS Routes */}
          <Route path="/visualizer/array" element={<ArrayHub />} />
          <Route path="/visualizer/array/:algoId" element={<Array3DVisualizer />} />
          <Route path="/visualizer/graph" element={<GraphHub />} />
          <Route path="/visualizer/graph/:algoId" element={<GraphVisualizer />} />
          <Route path="/visualizer/linkedlist" element={<LinkedListHub />} />
          <Route path="/visualizer/linkedlist/:algoId" element={<LinkedListVisualizer />} />
          <Route path="/visualizer/string" element={<StringHub />} />
          <Route path="/visualizer/string/:algoId" element={<StringVisualizer />} />
          <Route path="/visualizer/tree" element={<TreeHub />} />
          <Route path="/visualizer/tree/:algoId" element={<TreeGraphVisualizer />} />
          <Route path="/visualizer/stack" element={<StackHub />} />
          <Route path="/visualizer/stack/:algoId" element={<StackVisualizer />} />
          <Route path="/visualizer/queue" element={<QueueHub />} />
          <Route path="/visualizer/queue/:algoId" element={<QueueVisualizer />} />
          <Route path="/visualizer/heap" element={<HeapVisualizer />} />
          <Route path="/visualizer/map" element={<MapVisualizer />} />

          {/* OOP Nested Architecture */}
          <Route path="/oop" element={<OopLayout />}>
            <Route index element={<OopOverview />} />
            <Route
              path="abstraction"
              element={<AbstractionVisualizer isEmbedded={true} onNext={() => navigate('/oop/inheritance/single')} />}
            />
            <Route
              path="encapsulation"
              element={<EncapsulationVisualizer isEmbedded={true} onNext={() => navigate('/oop/abstraction')} />}
            />
            <Route
              path="inheritance"
              element={<Navigate to="/oop/inheritance/hierarchical" replace />}
            />
            <Route
              path="inheritance/single"
              element={<SingleInheritanceVisualizer isEmbedded={true} onNext={() => navigate('/oop/inheritance/multilevel')} />}
            />
            <Route
              path="inheritance/multilevel"
              element={<MultilevelInheritanceVisualizer isEmbedded={true} onNext={() => navigate('/oop/polymorphism')} />}
            />
            <Route
              path="inheritance/hierarchical"
              element={<InheritanceVisualizer isEmbedded={true} onNext={() => navigate('/oop/polymorphism')} />}
            />
            <Route
              path="inheritance/:type"
              element={<OopInheritanceDispatcher />}
            />
            <Route
              path="polymorphism"
              element={<PolymorphismVisualizer isEmbedded={true} onNext={() => navigate('/oop')} />}
            />
          </Route>

          {/* Legacy / Backward-Compatible OOP Redirects */}
          <Route path="/oops" element={<Navigate to="/oop" replace />} />
          <Route path="/oops/*" element={<Navigate to="/oop" replace />} />
          <Route path="/visualizer/oop" element={<Navigate to="/visualizer?cat=oop" replace />} />
          <Route path="/visualizer/oops" element={<Navigate to="/visualizer?cat=oop" replace />} />
          <Route path="/visualizer/dsa" element={<Navigate to="/visualizer?cat=dsa" replace />} />
          <Route path="/visualizer/encapsulation" element={<Navigate to="/oop/encapsulation" replace />} />
          <Route path="/visualizer/abstraction" element={<Navigate to="/oop/abstraction" replace />} />
          <Route path="/visualizer/inheritance" element={<Navigate to="/oop/inheritance/hierarchical" replace />} />
          <Route path="/visualizer/inheritance/:type" element={<LegacyInheritanceRedirect />} />
          <Route path="/visualizer/oop/inheritance/:type?" element={<LegacyInheritanceRedirect />} />
          <Route path="/visualizer/polymorphism" element={<Navigate to="/oop/polymorphism" replace />} />

          {/* Crypto Routes */}
          <Route path="/crypto" element={<Navigate to="/visualizer/crypto" replace />} />
          <Route path="/cryptography" element={<Navigate to="/visualizer/crypto" replace />} />
          <Route path="/visualizer/crypto" element={<CryptoHub />} />
          <Route path="/visualizer/cryptography" element={<Navigate to="/visualizer/crypto" replace />} />
          <Route path="/visualizer/crypto/studio" element={<CryptoHub />} />
          <Route path="/visualizer/crypto/studio/:algoId" element={<CryptoHub />} />
          <Route path="/visualizer/crypto/:algoId" element={<CryptoHub />} />
          <Route path="/visualizer/caesar" element={<CryptoHub defaultAlgo="caesar" />} />
          <Route path="/visualizer/vigenere" element={<CryptoHub defaultAlgo="vigenere" />} />
          <Route path="/visualizer/playfair" element={<CryptoHub defaultAlgo="playfair" />} />
          <Route path="/visualizer/railfence" element={<CryptoHub defaultAlgo="railfence" />} />
          <Route path="/visualizer/columnar" element={<CryptoHub defaultAlgo="columnar" />} />
          <Route path="/visualizer/aes" element={<CryptoHub defaultAlgo="aes" />} />
          <Route path="/visualizer/rsa" element={<CryptoHub defaultAlgo="rsa" />} />
          <Route path="/visualizer/hash" element={<CryptoHub defaultAlgo="hash" />} />
          <Route path="/visualizer/signature" element={<CryptoHub defaultAlgo="signature" />} />
          <Route path="/visualizer/steg" element={<CryptoHub defaultAlgo="steg" />} />
          <Route path="/visualizer/enigma" element={<CryptoHub defaultAlgo="enigma" />} />
          <Route path="/visualizer/hacker" element={<CryptoHub defaultAlgo="hacker" />} />
          <Route path="/visualizer/dh" element={<CryptoHub defaultAlgo="dh" />} />

            {/* Game Routes */}
            <Route path="/game" element={<GameWorld />} />
            <Route path="/host" element={<HostDashboard />} />

            {/* Sandbox */}
            <Route path="/sandbox" element={<Sandbox />} />
          </Route>

          {/* Fallback to Intro */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
