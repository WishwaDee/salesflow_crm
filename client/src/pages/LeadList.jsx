import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { Search, Plus, ChevronRight, Filter, Download } from 'lucide-react';
import AddLeadModal from '../components/AddLeadModal';

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/leads?search=${search}&status=${statusFilter}`);
      setLeads(data);
    } catch (err) {
      console.error('Error fetching leads', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchLeads();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Qualified': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'Won': return 'bg-green-50 text-green-600 border-green-100';
      case 'Lost': return 'bg-red-50 text-red-600 border-red-100';
      case 'Contacted': return 'bg-orange-50 text-orange-600 border-orange-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Action Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-gray-400 font-medium"
              placeholder="Search leads by name, email, or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <select 
              className="pl-10 pr-8 py-3.5 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-50 outline-none transition-all appearance-none font-bold text-gray-700 min-w-[160px]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex items-center gap-2 px-5 py-3.5 bg-white text-gray-700 border border-gray-100 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <Plus className="w-5 h-5" />
            Create Lead
          </button>
        </div>
      </div>

      <AddLeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onLeadAdded={fetchLeads} 
      />

      {/* Table Container */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Lead Details</th>
                <th className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Value</th>
                <th className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Ownership</th>
                <th className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                  <tr><td colSpan="5" className="text-center py-20">
                    <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                        <span className="text-sm font-bold text-gray-400 italic">Syncing leads...</span>
                    </div>
                  </td></tr>
              ) : leads.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-20">
                    <div className="text-gray-400 italic font-medium">No records found matching your current filters.</div>
                  </td></tr>
              ) : (
                  leads.map((lead) => (
                      <tr key={lead._id} className="hover:bg-blue-50/30 transition-all duration-200 group">
                        <td className="px-10 py-6 text-left">
                          <div className="flex flex-col text-left">
                            <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{lead.name}</span>
                            <span className="text-xs font-medium text-gray-400 mt-0.5">{lead.companyName}</span>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-left">
                          <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider border ${getStatusStyle(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-10 py-6 text-left">
                          <div className="flex flex-col text-left">
                            <span className="font-black text-gray-900">${lead.estimatedDealValue?.toLocaleString()}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Est. Value</span>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-left">
                          <div className="flex items-center gap-3 text-left">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-500 uppercase">
                              {lead.assignedSalesperson?.name.charAt(0)}
                            </div>
                            <span className="text-sm font-bold text-gray-600">{lead.assignedSalesperson?.name}</span>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <Link 
                            to={`/leads/${lead._id}`} 
                            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </Link>
                        </td>
                      </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer info */}
        <div className="px-10 py-6 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Showing {leads.length} Active leads
            </p>
            <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-30" disabled>Previous</button>
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">1</div>
                <button className="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-30" disabled>Next</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LeadList;
