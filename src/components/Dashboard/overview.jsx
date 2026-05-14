// components/admin/Overview.jsx
import React, { useState } from 'react';

const Overview = ({ contactContent, loadContactData, saveSubmissions, clearAllSubmissions, viewSubmission }) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return 'No date';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = contactContent?.submissions?.filter(s => s.status === 'unread').length || 0;

  return (
    <>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 mb-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back! 👋</h2>
        <p className="opacity-90">Here's what's happening with your website today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Messages</p>
              <p className="text-3xl font-bold text-gray-800">{contactContent?.submissions?.length || 0}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Unread Messages</p>
              <p className="text-3xl font-bold text-gray-800">{unreadCount}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">This Month</p>
              <p className="text-3xl font-bold text-gray-800">
                {contactContent?.submissions?.filter(s => {
                  const date = s.timestamp?.toDate ? s.timestamp.toDate() : new Date(s.timestamp);
                  const now = new Date();
                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                }).length || 0}
              </p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Today's Messages</p>
              <p className="text-3xl font-bold text-gray-800">
                {contactContent?.submissions?.filter(s => {
                  const date = s.timestamp?.toDate ? s.timestamp.toDate() : new Date(s.timestamp);
                  const today = new Date();
                  return date.toDateString() === today.toDateString();
                }).length || 0}
              </p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Submissions Section - Card View */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-800">Contact Submissions</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <span className="text-sm text-gray-500">
              Total: {contactContent?.submissions?.length || 0}
            </span>
            <button
              onClick={loadContactData}
              className="text-sm text-blue-600 hover:text-blue-800"
              title="Refresh"
            >
              ⟳
            </button>
          </div>
        </div>
        
        {/* Submission Action Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={saveSubmissions}
            className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
          >
            Save Changes
          </button>
          <button
            onClick={clearAllSubmissions}
            className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
          >
            Clear All
          </button>
        </div>
        
        {!contactContent?.submissions || contactContent.submissions.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-500">No submissions yet</p>
            <p className="text-sm text-gray-400 mt-1">Contact form submissions will appear here</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {contactContent.submissions
              .sort((a, b) => {
                const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
                const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
                return dateB - dateA;
              })
              .map((submission) => (
              <div
                key={submission.id}
                className={`p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer ${
                  submission.status === 'unread' 
                    ? 'border-l-4 border-l-red-500 bg-red-50 hover:bg-red-100' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => viewSubmission(submission)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-gray-800">{submission.name}</h4>
                    {submission.status === 'unread' && (
                      <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                        NEW
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(submission.timestamp)}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Email:</span> {submission.email}
                </p>
                
                {submission.phone && (
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Phone:</span> {submission.phone}
                  </p>
                )}
                
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Subject:</span> {submission.subject}
                </p>
                
                <p className="text-sm text-gray-700 mt-2 pt-2 border-t border-gray-200">
                  {submission.message.length > 150 
                    ? `${submission.message.substring(0, 150)}...` 
                    : submission.message}
                </p>
                
                {submission.service && (
                  <p className="text-xs text-gray-400 mt-2">
                    Service: {submission.service}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Overview;