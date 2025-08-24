// frontend/app/dashboard/[affiliateId]/page.js

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function AffiliateDashboard() {
  const { affiliateId } = useParams();
  const [affiliateData, setAffiliateData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (affiliateId) {
      const fetchData = async () => {
        try {
          const res = await fetch(`http://localhost:3001/api/affiliate/${affiliateId}`);
          if (!res.ok) {
            throw new Error('Failed to fetch affiliate data');
          }
          const data = await res.json();
          setAffiliateData(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [affiliateId]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-xl text-gray-700">Loading...</div>;
  }

  if (!affiliateData) {
    return <div className="flex items-center justify-center min-h-screen text-xl text-gray-500">No data found for this affiliate.</div>;
  }

  const { clicks, conversions } = affiliateData;

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="container mx-auto max-w-5xl bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <Link href="/" passHref legacyBehavior>
          <a className="inline-flex items-center text-blue-600 hover:underline mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Affiliates
          </a>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Affiliate Dashboard (ID: {affiliateId})</h1>

        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-6 rounded-lg mb-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Unique Postback URL</h2>
          <code className="bg-blue-100 text-blue-900 p-3 rounded-md text-sm break-all block">
            https://affiliate-system.com/postback?affiliate_id={affiliateId}&click_id=...&amount=...&currency=...
          </code>
          <p className="mt-2 text-blue-700 text-sm">Provide this URL format to advertisers for conversion tracking.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Conversions ({conversions.length})</h2>
            {conversions.length > 0 ? (
              <ul className="space-y-4">
                {conversions.map(conv => (
                  <li key={conv.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                    <p className="text-gray-900 font-medium">Click ID: {conv.click_id}</p>
                    <p className="text-green-600 font-bold mt-1">Amount: {conv.amount} {conv.currency}</p>
                    <p className="text-xs text-gray-500 mt-2">Timestamp: {new Date(conv.timestamp).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500 border-dashed border-2 border-gray-300">
                No conversions found.
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Clicks ({clicks.length})</h2>
            {clicks.length > 0 ? (
              <ul className="space-y-4">
                {clicks.map(click => (
                  <li key={click.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                    <p className="text-gray-900 font-medium">Click ID: {click.click_id}</p>
                    <p className="text-gray-600 mt-1">Campaign: {click.campaign_name}</p>
                    <p className="text-xs text-gray-500 mt-2">Timestamp: {new Date(click.timestamp).toLocaleString()}</p>
                    <p className="mt-2 text-sm font-semibold">
                      {click.conversion_count > 0 ? (
                        <span className="text-green-600 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Converted
                        </span>
                      ) : (
                        <span className="text-red-500 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          No Conversion yet
                        </span>
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500 border-dashed border-2 border-gray-300">
                No clicks found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}