"use client";

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { renderContent } from '@/utils/prismic-fetcher';
import NotFound from '@/components/404';
import { SliceZone } from '@prismicio/react';
import { components } from '@/slices';

const Page = () => {
    const path = usePathname();
    const router = useRouter();

    // Determine the slug based on the path
    const slug = path === '/' ? 'home' : path.split('/').pop();

    const [content, setContent] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                // Fetch content based on the slug
                const response = await renderContent(slug);

                // Redirect if the UID does not match the full UID
                if (response.uid !== response.fullUid) {
                    const hash = window.location.hash;
                    router.replace(`/${response.fullUid}${hash}`);
                }

                // Set the fetched content
                setContent(response);
                setError(false); // Reset error state if content is fetched successfully
            } catch (error) {
                console.error('Error fetching content:', error);
                setError(true); // Set error state if fetching content fails
            }
        };

        fetchContent();
    }, [slug, router]);

    // Render NotFound component if there is an error
    if (error) {
        return <NotFound />;
    }

    return (
        <div className="h-full w-full flex flex-col">
            <main className="mb-4 flex-grow overflow-auto break-words whitespace-normal h-full w-full">
                {content && (
                    <div className="flex flex-row flex-wrap items-center justify-center">
                        <SliceZone slices={content.data.slices} components={components} />
                    </div>
                )}
            </main>
            <footer className="bottom-0 w-full h-12 border-t border-primary flex items-center justify-center">
                <div className="flex items-center gap-4 text-xs">
                  <h6>Website door <a href="https://www.manoukvandraanen.com" target="_blank" rel="noopener noreferrer">Manouk van Draanen</a></h6>
                  <span>|</span>
                  <a href="/privacy">Privacybeleid</a>
                </div>
            </footer>
        </div>
    );
};

export default Page;