import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Calendar, Mail, Phone, Building2, User, DollarSign, MessageSquare, Send, Edit2, Trash2, Check, X, ArrowLeft } from 'lucide-react';

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteContent, setNoteContent] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});

  const fetchLead = async () => {
    try {
      const { data } = await API.get(`/leads/${id}`);
      setLead(data);
      setEditForm(data);
    } catch (err) {
      console.error('Error fetching lead', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLead();
  }, [id]);

  const handleUpdateLead = async (e) => {
    if (e) e.preventDefault();
    setIsUpdating(true);
    try {
      await API.put(`/leads/${id}`, editForm);
      setIsEditMode(false);
      fetchLead();
    } catch (err) {
      alert('Failed to update lead');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      await API.put(`/leads/${id}`, { status: newStatus });
      fetchLead();
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteLead = async () => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
        try {
            await API.delete(`/leads/${id}`);
            navigate('/leads');
        } catch (err) {
            alert('Failed to delete lead');
        }
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    try {
      await API.post(`/leads/${id}/notes`, { content: noteContent });
      setNoteContent('');
      fetchLead();
    } catch (err) {
      alert('Failed to add note');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  if (!lead) return <div className="text-center py-20 text-gray-500 font-bold">Record not found.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 text-left">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 text-left">
        <div className="flex items-center gap-6 text-left">
          <button 
            onClick={() => navigate('/leads')}
            className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-left">
            {isEditMode ? (
              <input 
                  className="text-3xl font-black text-gray-900 border-b-2 border-blue-500 outline-none bg-transparent py-1 w-full"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              />
            ) : (
              <h1 className="text-3xl font-black text-gray-900 leading-tight">{lead.name}</h1>
            )}
            <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mt-1">{lead.companyName}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="relative">
             <select 
                disabled={isUpdating}
                className="bg-gray-50 border-none rounded-xl px-6 py-3.5 outline-none focus:ring-4 focus:ring-blue-50 text-sm font-black uppercase tracking-wider text-gray-700 appearance-none min-w-[160px]"
                value={lead.status}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
          </div>

          {isEditMode ? (
            <div className="flex gap-2">
                <button onClick={handleUpdateLead} className="bg-green-600 text-white px-6 py-3.5 rounded-xl flex items-center gap-2 text-sm font-black uppercase tracking-wider hover:bg-green-700 shadow-lg shadow-green-100 transition-all">
                    <Check className="w-4 h-4" /> Save
                </button>
                <button onClick={() => setIsEditMode(false)} className="bg-gray-100 text-gray-600 px-6 py-3.5 rounded-xl flex items-center gap-2 text-sm font-black uppercase tracking-wider hover:bg-gray-200 transition-all">
                    <X className="w-4 h-4" /> Cancel
                </button>
            </div>
          ) : (
            <button onClick={() => setIsEditMode(true)} className="bg-blue-600 text-white px-6 py-3.5 rounded-xl flex items-center gap-2 text-sm font-black uppercase tracking-wider hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
                <Edit2 className="w-4 h-4" /> Edit
            </button>
          )}
          <button onClick={handleDeleteLead} className="bg-red-50 text-red-600 px-6 py-3.5 rounded-xl flex items-center gap-2 text-sm font-black uppercase tracking-wider hover:bg-red-100 transition-all">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Info Sidebar */}
        <div className="lg:col-span-1 space-y-8 text-left">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-50 space-y-8 text-left">
            <div className="text-left">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="group text-left">
                  <label className="text-[10px] font-black text-gray-300 uppercase block mb-1">Email Address</label>
                  {isEditMode ? (
                      <input className="text-sm font-bold text-gray-700 border-b border-gray-100 outline-none w-full py-1 focus:border-blue-500" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} />
                  ) : <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">{lead.email}</span>}
                </div>
                <div className="group text-left">
                  <label className="text-[10px] font-black text-gray-300 uppercase block mb-1">Phone Number</label>
                  {isEditMode ? (
                      <input className="text-sm font-bold text-gray-700 border-b border-gray-100 outline-none w-full py-1 focus:border-blue-500" value={editForm.phoneNumber} onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})} />
                  ) : <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">{lead.phoneNumber}</span>}
                </div>
                <div className="group text-left">
                  <label className="text-[10px] font-black text-gray-300 uppercase block mb-1">Estimated Value</label>
                  {isEditMode ? (
                      <input type="number" className="text-sm font-bold text-gray-700 border-b border-gray-100 outline-none w-full py-1 focus:border-blue-500" value={editForm.estimatedDealValue} onChange={(e) => setEditForm({...editForm, estimatedDealValue: e.target.value})} />
                  ) : <span className="text-xl font-black text-gray-900">${lead.estimatedDealValue?.toLocaleString()}</span>}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-50 text-left">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Metadata</h3>
              <div className="grid grid-cols-2 gap-6 text-left">
                <div className="text-left">
                  <label className="text-[9px] font-black text-gray-300 uppercase block mb-1">Source</label>
                  <span className="text-xs font-bold text-gray-600">{lead.leadSource}</span>
                </div>
                <div className="text-left">
                  <label className="text-[9px] font-black text-gray-300 uppercase block mb-1">Created</label>
                  <span className="text-xs font-bold text-gray-600">{new Date(lead.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Content */}
        <div className="lg:col-span-2 space-y-8 text-left">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-50 text-left">
            <div className="flex items-center justify-between mb-10 text-left">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                Activity Timeline
              </h3>
              <span className="px-4 py-1.5 bg-gray-50 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-wider">
                {lead.notes?.length || 0} Total Updates
              </span>
            </div>

            <form onSubmit={handleAddNote} className="mb-12 relative text-left">
              <textarea
                className="w-full p-6 bg-gray-50 border-none rounded-3xl outline-none focus:ring-4 focus:ring-blue-50 transition-all text-sm font-medium min-h-[120px] placeholder:text-gray-400"
                placeholder="Type an update or internal note..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />
              <button 
                type="submit"
                className="absolute bottom-4 right-4 bg-gray-900 text-white p-3 rounded-2xl hover:bg-blue-600 transition-all shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>

            <div className="space-y-10 relative text-left">
              {/* Vertical line for timeline */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-50"></div>

              {lead.notes?.slice().reverse().map((note, idx) => (
                <div key={idx} className="flex gap-8 relative z-10 text-left animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="w-12 h-12 rounded-2xl bg-white border-4 border-gray-50 flex items-center justify-center text-blue-600 font-black text-sm shadow-sm flex-shrink-0">
                    {note.createdBy?.name?.charAt(0)}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-black text-gray-900">{note.createdBy?.name}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(note.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-50 italic">
                      <p className="text-sm text-gray-600 leading-relaxed font-medium">"{note.content}"</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {(!lead.notes || lead.notes.length === 0) && (
                <div className="text-center py-10">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="text-gray-300 w-8 h-8" />
                    </div>
                    <p className="text-sm font-bold text-gray-400 italic">No activity recorded for this lead yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
