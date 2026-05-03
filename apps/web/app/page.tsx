import React from 'react';

export default function Home() {
  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-rose-700 mb-6">
          Every Drop Counts. <br /> Connect in Seconds.
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          The world's fastest real-time blood donation matching platform. 
          Save lives with instant geo-targeted requests and donor matching.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="premium-button px-8 py-4 rounded-full font-bold text-lg">
            Donate Now
          </button>
          <button className="glass-card px-8 py-4 rounded-full font-bold text-lg border border-red-500/30">
            Request Blood
          </button>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
        {[
          { label: 'Active Donors', value: '1.2M+' },
          { label: 'Lives Saved', value: '450K+' },
          { label: 'Avg. Match Time', value: '< 2 mins' },
          { label: 'Hospitals Joined', value: '850+' },
        ].map((stat, i) => (
          <div key={stat.label} className="glass-card p-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
            <h3 className="text-3xl font-bold text-red-500">{stat.value}</h3>
            <p className="text-gray-400 uppercase tracking-wider text-sm">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Map Placeholder */}
      <section className="mb-20">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-3xl font-bold">Real-time Donor Map</h2>
            <p className="text-gray-400">Showing active donors and urgent requests in your area</p>
          </div>
          <div className="flex gap-2">
            {['A+', 'O-', 'B+', 'AB-'].map(type => (
              <span key={type} className="px-3 py-1 rounded-md bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold">
                {type}
              </span>
            ))}
          </div>
        </div>
        <div className="map-container glass-card flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=2000')] bg-cover opacity-20" />
          <div className="relative z-10 text-center p-8">
            <div className="w-16 h-16 bg-red-500 rounded-full animate-ping mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Map logic integrated with Leaflet & PostGIS</p>
            <p className="text-sm text-gray-500">Live donor search active in 5km radius</p>
          </div>
        </div>
      </section>

      {/* Quick Request Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="glass-card p-8">
          <h2 className="text-3xl font-bold mb-6">Create Urgent Request</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Blood Type</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-red-500 transition-colors">
                  <option>Select Type</option>
                  <option>O-</option>
                  <option>A+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Urgency</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-red-500 transition-colors">
                  <option>NORMAL</option>
                  <option className="text-red-500 font-bold">CRITICAL</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Hospital Name</label>
              <input type="text" placeholder="Enter hospital name" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-red-500 transition-colors" />
            </div>
            <button className="premium-button w-full py-4 rounded-lg font-bold text-lg mt-4">
              Broadcast Request
            </button>
          </form>
        </div>
        <div className="space-y-6">
          <h2 className="text-4xl font-bold leading-tight">Matched in milliseconds, <br /> delivered in minutes.</h2>
          <p className="text-gray-400 text-lg">
            Our match engine uses Elasticsearch geo-spatial indexing to find the perfect donor within seconds. 
            Automated alerts are sent via Socket.io and Kafka to ensure zero latency in life-saving situations.
          </p>
          <ul className="space-y-4">
            {['Global Geo-spatial Donor Search', 'Real-time WebSocket Notifications', 'Automated Donor Eligibility Check', 'Hospital Inventory Management'].map(feature => (
              <li key={feature} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                </div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
