import { useRevenueStore } from '@/state/revenue';
import React, { useEffect } from 'react';

const RecentRevenue: React.FC = () => {
  const { revenue, loadingRevenue, fetchRecentRevenue } = useRevenueStore();

  useEffect(() => {
    fetchRecentRevenue();
  }, [fetchRecentRevenue]);

  // Handle loading state
  if (loadingRevenue) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold text-primary mb-4">Loading Recent Orders...</h2>
      </div>
    );
  }

  // Handle empty revenue case
  if (!revenue || revenue.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-primary mb-4">No Recent Orders Found</h2>
      </div>
    );
  }

  // Format the date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="p-5 bg-white rounded-2xl shadow-sm border border-gray-300 border-opacity-50 w-3/6">
      <h2 className="font-bold text-primary mb-4">Recent Orders</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {['Document', 'Amount', 'Date', 'OR No'].map((header) => (
              <th
                key={header}
                scope="col"
                className="py-3 px-6 text-left font-bold text-gray-600 text-xs tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {revenue.map((order, index) => (
            <tr key={index}>
              <td className="py-3 px-6 whitespace-nowrap text-zinc-600 text-sm">
                {order.certType}
              </td>
              <td className="py-3 px-6 whitespace-nowrap text-xs text-zinc-600 font-semibold">
              Php {order.amount}
              </td>
              <td className="py-3 px-6 whitespace-nowrap text-xs text-zinc-600">
                {formatDate(order.time)}
              </td>
              <td className="py-3 px-6 whitespace-nowrap text-xs">
                <span className="text-primary btn btn-outline btn-xs">
                  {order.orNo}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentRevenue;