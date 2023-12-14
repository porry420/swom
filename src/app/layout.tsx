'use client';
import './globals.css';
import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Script from 'next/script';
import { StateProvider } from '@/context/StateContext';
import CookieConsent from 'react-cookie-consent';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import React from 'react';

// export const metadata: Metadata = {
//   title: 'Create Next App',
//   description: 'Generated by create next app',
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
  );

  const options = {
    // passing the client secret obtained from the server
    clientSecret: process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY,
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <html lang="en">
      <StateProvider>
        <CookieConsent
          location="none"
          buttonText="Accept"
          cookieName="myAwesomeCookieName2"
          style={{
            background: '#7F8119',
            color: '#fff !important',
            fontSize: '20px',
            display: 'flex',
            // flexDirection: 'column',
            width: '60%',
            bottom: '10px',
            left: 'auto',
            right: '5%',
            height: 'fit-content',
            zIndex: 10000000,
            justifyContent: 'center',
          }}
          buttonStyle={{
            color: '#4e503b',
            fontSize: '20px',
            alignContent: 'center',
            display: 'flex',
            margin: 'auto',
          }}
          expires={150}>
          <div className="m-auto w-full text-white text-center h-fit flex-none">
            We value your privacy <br />
            <span
              style={{
                fontSize: '16px',
                textAlign: 'left',
                color: 'white',
              }}>
              We use cookies to enhance your experience on our website. By
              continuing to use our website, you consent to the use of cookies.
            </span>
          </div>
        </CookieConsent>
        <Elements
          stripe={stripePromise}
          // options={options}
        >
          <body className="relative">
            <>
              {loading && (
                <div
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(255, 255, 255)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000, // Adjust as needed
                  }}>
                  Loading...
                </div>
              )}
              <Navigation />
              {children}
              <Footer />
              <Script src="https://player.vimeo.com/api/player.js"></Script>
            </>
          </body>
        </Elements>
      </StateProvider>
    </html>
  );
}
