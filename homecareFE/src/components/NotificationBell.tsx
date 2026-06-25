import React, { useState } from 'react';

export const NotificationBell: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState(3);

  return (
    <button 
      onClick={() => setUnreadCount(0)}
      className="relative p-2.5 text-stone-400 hover:text-primary hover:bg-teal-50 rounded-xl transition-all"
      title="Notifications"
    >
      <span className="material-symbols-outlined text-2xl">notifications</span>
      {unreadCount > 0 && (
        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-[9px] font-bold text-white rounded-full flex items-center justify-center border border-white">
          {unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
