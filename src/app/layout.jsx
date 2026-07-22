import {ClerkProvider} from "@clerk/nextjs";
import './globals.css';
import { PrismicPreview } from "@prismicio/next";
import { repositoryName } from "@/prismicio";
import NavigationMenu from '@/components/navigation-menu';
import SocialBar from '@/components/social-bar';
import SearchBar from '@/components/search-bar';
import { buildMenu } from '@/utils/menu-builder';
import Head from 'next/head';

export default async function RootLayout({ children }) {
  // Fetch menu items asynchronously
  const menuItems = await buildMenu();

  return (
    <html lang="en">
      <Head>
        <title>Fietsmaatjes Amsterdam Nieuw Sloten</title>
        <meta name="description" content="Welkom bij Fietsmaatjes Amsterdam Nieuw Sloten. Stap samen op de duofiets, voor een gezellig uitje in de omgeving. We zijn er voor jong en oud!" />
        <meta name="keywords" content="fietsmaatjes, fietsmaatje, amsterdam, nieuw-sloten, duofiets, samenfietsen, fietsen, fiets, maatje, maatjes" />
      </Head>
      <body className="h-[100dvh] w-[100dvw] flex flex-col">
        <ClerkProvider>
          <header className={`
          fixed top-0 left-0 w-full h-16 px-4
          bg-primary flex items-center justify-between z-10
          `}>
          {/* Render navigation menu with fetched menu items */}
          <NavigationMenu menuItems={menuItems} />
          <div className="flex items-center gap-4">
          {/* Render social bar and search bar */}
          <SocialBar />
          <SearchBar />
          </div>
          </header>
          <main className="flex-grow mt-16">
          {/* Render children components */}
          {children}
          {/* Prismic preview component */}
          <PrismicPreview repositoryName={repositoryName} />
          </main>
        </ClerkProvider>
      </body>
    </html>
  );
}