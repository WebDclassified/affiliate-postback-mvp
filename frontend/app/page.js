// frontend/app/page.js

'use client'; // This is a Next.js directive for client-side components

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the list of affiliates from your backend API
    const fetchAffiliates = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/affiliates');
        if (!res.ok) {
          throw new Error('Failed to fetch affiliates');
        }
        const data = await res.json();
        setAffiliates(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAffiliates();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-4xl font-bold text-center mb-8">Affiliate Dashboard</h1>
      <p className="text-center text-gray-600 mb-8">Select an affiliate to view their dashboard.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {affiliates.map(affiliate => (
          <Link href={`/dashboard/${affiliate.id}`} key={affiliate.id} passHref legacyBehavior>
            <a className="bg-gray-100 border border-gray-300 p-6 rounded-lg shadow-sm hover:bg-gray-200 transition-colors duration-200 block text-center">
              <h2 className="text-2xl font-semibold">{affiliate.name}</h2>
              <p className="text-sm text-gray-500 mt-1">ID: {affiliate.id}</p>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}