import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Users, UserPlus, CheckCircle, TrendingUp, DollarSign, XCircle, ArrowUpRight, Clock } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/leads/dashboard');
        setStats(data);
      } catch (err) {
        console.error('Error fetching dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  const cards = [
    { title: 'Total Leads', value: stats?.totalLeads, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12%' },
    { title: 'Qualified', value: stats?.qualifiedLeads, icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+5%' },
    { title: 'Won Leads', value: stats?.wonLeads, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', trend: '+18%' },
    { title: 'Pipeline Value', value: `$${stats?.totalEstimatedValue?.toLocaleString()}`, icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+24%' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-50 hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-6">
              <div className={`${card.bg} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                <card.icon className={`w-7 h-7 ${card.color}`} />
              </div>
              <div className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold">
                <ArrowUpRight className="w-3 h-3" />
                {card.trend}
              </div>
            </div>
            <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">{card.title}</h3>
            <p className="text-3xl font-black text-gray-900 mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Pipeline Chart */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-50 text-left">
          <div className="flex items-center justify-between mb-10 text-left">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Conversion Funnel</h3>
              <p className="text-sm text-gray-400 mt-1">Lead stage distribution</p>
            </div>
            <select className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-gray-500 outline-none">
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
            </select>
          </div>
          
          <div className="space-y-8 text-left">
            {[
              { label: 'New', count: stats?.newLeads, color: 'bg-blue-500' },
              { label: 'Qualified', count: stats?.qualifiedLeads, color: 'bg-purple-500' },
              { label: 'Won', count: stats?.wonLeads, color: 'bg-green-500' },
              { label: 'Lost', count: stats?.lostLeads, color: 'bg-red-500' },
            ].map((stage) => {
              const percentage = Math.round((stage.count / (stats?.totalLeads || 1)) * 100);
              return (
                <div key={stage.label}>
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-sm font-bold text-gray-700">{stage.label}</span>
                    <span className="text-sm font-black text-gray-900">{stage.count} <span className="text-gray-400 font-medium ml-1">({percentage}%)</span></span>
                  </div>
                  <div className="w-full bg-gray-50 rounded-full h-4 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${stage.color}`} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Financial Card */}
        <div className="bg-gradient-to-br from-gray-900 to-blue-900 p-10 rounded-[2.5rem] shadow-2xl flex flex-col justify-between text-left text-white overflow-hidden relative group">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full group-hover:scale-110 transition-transform duration-700"></div>
          <div className="relative">
            <div className="bg-white/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md">
              <TrendingUp className="text-blue-400 w-6 h-6" />
            </div>
            <h3 className="text-blue-100/60 text-sm font-bold uppercase tracking-widest">Closed Revenue</h3>
            <p className="text-4xl font-black mt-2 leading-tight">
              ${stats?.totalWonValue?.toLocaleString()}
            </p>
            <div className="mt-6 flex items-center gap-2 text-blue-300">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider italic">Real-time Data</span>
            </div>
          </div>
          
          <div className="relative mt-auto pt-10 border-t border-white/10">
            <p className="text-sm text-blue-200/70 font-medium leading-relaxed">
              You are <span className="text-white font-bold">24%</span> ahead of your monthly target. Keep the momentum going!
            </p>
            <button className="mt-6 w-full py-3 bg-white text-blue-900 rounded-2xl text-sm font-black shadow-lg hover:bg-blue-50 transition-colors">
                View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
