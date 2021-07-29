import Head from "next/head";
import { useRouter } from "next/router";

import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  ClerkLoaded,
} from "@clerk/clerk-react";

import Layout from "../components/Layout";

import "../styles/normalize.css";
import "../styles/styles.css";

const clerkFrontendAPI = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API;

const publicPages = [
  "/",
  "/sign-in/[[...index]]",
  "/sign-up/[[...index]]",
  "/404",
];

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <ClerkProvider
      frontendApi={clerkFrontendAPI}
      navigate={(to) => router.push(to)}
    >
      <Head>
        <meta name="description" content="Mini Coding Bootcamp" />
        <meta name="keywords" content="coding" />
        <meta name="theme-color" content="#ec3944" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta property="og:title" content="miniCodeCamp" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="" />
        <meta property="og:description" content="Mini Coding Bootcamp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="" />
        <meta name="twitter:title" content="miniCodeCamp" />
        <meta name="twitter:description" content="Mini Coding Bootcamp" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" href="/favicon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <title>miniCodeCamp</title>
      </Head>
      {publicPages.includes(router.pathname) ? (
        <ClerkLoaded>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ClerkLoaded>
      ) : (
        <>
          <SignedIn>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SignedIn>
          <SignedOut>
            <Layout>
              <RedirectToSignIn />
            </Layout>
          </SignedOut>
        </>
      )}
    </ClerkProvider>
  );
}

export default MyApp;
