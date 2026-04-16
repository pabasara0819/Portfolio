import React from 'react';

const Overview = ({ stats, recentMessages, setActiveTab }) => {
  return (
    <>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 mb-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back! 👋</h2>
        <p className="opacity-90">Here's what's happening with your website today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{stat.icon}</span>
              <span className={`text-sm font-semibold ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Messages */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Recent Messages</h2>
          <button 
            onClick={() => setActiveTab('messages')}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            View All →
          </button>
        </div>
        <div className="space-y-4">
          {recentMessages.map((message) => (
            <div key={message.id} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">{message.name}</p>
                  <p className="text-sm text-gray-500">{message.email}</p>
                  <p className="text-gray-600 mt-1">{message.message}</p>
                </div>
                <p className="text-sm text-gray-400">{message.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Overview;