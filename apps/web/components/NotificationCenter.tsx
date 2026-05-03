import React, { useState } from 'react';

type NotificationCategory = 'URGENT' | 'INFO' | 'SYSTEM';

interface Notification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  createdAt: Date;
  isRead: boolean;
}

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'Critical Request', message: 'O- required at City Hospital', category: 'URGENT', createdAt: new Date(), isRead: false },
    { id: '2', title: 'New Badge!', message: 'You earned "Life Saver" badge', category: 'INFO', createdAt: new Date(), isRead: true },
  ]);
  const [filter, setFilter] = useState<NotificationCategory | 'ALL'>('ALL');

  const filtered = filter === 'ALL' ? notifications : notifications.filter(n => n.category === filter);

  return (
    <div className="glass-card w-96 p-4 absolute right-0 mt-2 z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Notifications</h3>
        <div className="flex gap-2 text-xs">
          {['ALL', 'URGENT', 'INFO'].map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`px-2 py-1 rounded ${filter === cat ? 'bg-red-500 text-white' : 'bg-white/5'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {filtered.map(n => (
          <div key={n.id} className={`p-3 rounded-lg border ${n.category === 'URGENT' ? 'border-red-500/30 bg-red-500/5' : 'border-white/10 bg-white/5'}`}>
            <div className="flex justify-between items-start mb-1">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${n.category === 'URGENT' ? 'bg-red-500' : 'bg-blue-500'}`}>
                {n.category}
              </span>
              <span className="text-[10px] text-gray-500">2m ago</span>
            </div>
            <h4 className="font-bold text-sm">{n.title}</h4>
            <p className="text-xs text-gray-400">{n.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
