/**
 * Enhanced App with HelmetProvider and lazy loading
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import { SkeletonGrid } from './components/Skeleton';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const SongDetailPage = lazy(() => import('./pages/SongDetailPage'));
const UploadPage = lazy(() => import('./pages/UploadPage'));
const ManualEntryPage = lazy(() => import('./pages/ManualEntryPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));

// Loading fallback component
const PageLoader = () => (
  <div className="container-custom py-12">
    <SkeletonGrid count={6} />
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/song/:id" element={<SongDetailPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/add" element={<ManualEntryPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />

              {/* 404 Page */}
              <Route path="*" element={
                <div className="glass rounded-xl p-12 text-center max-w-2xl mx-auto">
                  <div className="text-6xl mb-4">🎸</div>
                  <h1 className="text-4xl font-bold gradient-text mb-4">Page Not Found</h1>
                  <p className="text-text-secondary mb-8">
                    The page you're looking for doesn't exist.
                  </p>
                  <a
                    href="/"
                    className="inline-block bg-gradient-to-r from-accent-primary to-accent-secondary text-white px-8 py-3 rounded-xl font-semibold shadow-glow"
                  >
                    Go Home
                  </a>
                </div>
              } />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
