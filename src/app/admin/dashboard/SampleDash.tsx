import React from 'react';

const orders = [
  { document: 'Barangay clearance', price: '₱50', date: 'Aug 21, 2024', status: 'Delivered', statusColor: 'text-green-500' },
  { document: 'Barangay clearance', price: '₱50', date: 'Aug 19, 2024', status: 'On Going', statusColor: 'text-yellow-500' },
  { document: 'Business permit', price: '₱50', date: 'Aug 19, 2024', status: 'Delivered', statusColor: 'text-green-500' },
  { document: 'Indigency', price: '₱50', date: 'Aug 21, 2024', status: 'Declined', statusColor: 'text-red-500' },
];

const SampleDash: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-primary mb-4">Recent Orders</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {['Document', 'Price', 'Date', 'Status'].map((header) => (
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
          {orders.map((order, index) => (
            <tr key={index}>
              <td className="py-3 px-6 whitespace-nowrap text-zinc-600 text-sm">{order.document}</td>
              <td className="py-3 px-6 whitespace-nowrap text-xs text-zinc-600 font-semibold">{order.price}</td>
              <td className="py-3 px-6 whitespace-nowrap text-xs text-zinc-600 ">{order.date}</td>
              <td className="py-3 px-6 whitespace-nowrap text-xs">
                <span className={`${order.statusColor} btn btn-outline btn-xs`}>{order.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SampleDash;
