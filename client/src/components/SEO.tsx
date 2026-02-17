/**
 * SEO Component
 * Dynamic meta tags using react-helmet-async
 */

import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    type?: 'website' | 'music.song';
    image?: string;
    url?: string;
}

export default function SEO({
    title = 'ChordFlow - Free Guitar Chords & Tabs',
    description = 'Free guitar chords and tabs for musicians. No sign-up required. Browse thousands of songs with smart chord highlighting.',
    type = 'website',
    image = '/og-image.png',
    url = 'https://chordflow.app'
}: SEOProps) {
    const fullTitle = title.includes('ChordFlow') ? title : `${title} | ChordFlow`;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content="ChordFlow" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Additional Meta Tags */}
            <meta name="keywords" content="guitar chords, tabs, guitar tabs, chord sheets, free chords, music, guitar lessons" />
            <meta name="author" content="ChordFlow" />
            <meta name="theme-color" content="#8b5cf6" />

            {/* PWA Meta Tags */}
            <link rel="manifest" href="/manifest.json" />
            <link rel="apple-touch-icon" href="/icon-192.png" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            <meta name="apple-mobile-web-app-title" content="ChordFlow" />
        </Helmet>
    );
}
