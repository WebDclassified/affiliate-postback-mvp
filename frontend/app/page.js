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
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!affiliateData) {
    return <div className="p-8 text-center">No data found for this affiliate.</div>;
  }

  const { clicks, conversions } = affiliateData;

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Link href="/" passHref legacyBehavior>
        <a className="text-blue-600 hover:underline mb-4 block">&larr; Back to Affiliates</a>
      </Link>
      <h1 className="text-3xl font-bold mb-6">Affiliate Dashboard (ID: {affiliateId})</h1>

      <div className="bg-gray-100 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-2">Unique Postback URL</h2>
        <code className="bg-white p-3 rounded-md text-sm break-all block">
          https://affiliate-system.com/postback?affiliate_id={affiliateId}&click_id=...&amount=...&currency=...
        </code>
        <p className="mt-2 text-gray-600 text-sm">Provide this URL format to advertisers for conversion tracking.</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Conversions</h2>
        {conversions.length > 0 ? (
          <ul className="space-y-4">
            {conversions.map(conv => (
              <li key={conv.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <p><strong>Click ID:</strong> {conv.click_id}</p>
                <p><strong>Amount:</strong> {conv.amount} {conv.currency}</p>
                <p><strong>Timestamp:</strong> {new Date(conv.timestamp).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No conversions found.</p>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Clicks</h2>
        {clicks.length > 0 ? (
          <ul className="space-y-4">
            {clicks.map(click => (
              <li key={click.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <p><strong>Click ID:</strong> {click.click_id}</p>
                <p><strong>Campaign:</strong> {click.campaign_name}</p>
                <p><strong>Timestamp:</strong> {new Date(click.timestamp).toLocaleString()}</p>
                <p className="mt-2 text-sm text-green-600">
                    {click.conversion_count > 0 ? `✅ Converted` : `❌ No Conversion yet`}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No clicks found.</p>
        )}
      </div>
    </div>
  );
}