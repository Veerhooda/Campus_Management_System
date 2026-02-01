
import React, { useState } from 'react';
import { CATEGORIES } from '../constants';
import { TicketPriority, TicketStatus, Category } from '../types';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    subject: '',
    category: 'General' as Category,
    priority: TicketPriority.MEDIUM,
    description: ''
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1e293b] w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h3 className="text-lg font-bold">Create New Ticket</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form className="p-6 space-y-4" onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
        }}>
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <input 
              required
              className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-primary focus:border-primary"
              type="text" 
              placeholder="Brief summary of the issue"
              value={formData.subject}
              onChange={e => setFormData({...formData, subject: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select 
                className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as Category})}
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select 
                className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value as TicketPriority})}
              >
                {Object.values(TicketPriority).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea 
              required
              rows={4}
              className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-primary focus:border-primary"
              placeholder="Details about the grievance..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-2 px-4 rounded-lg bg-primary text-white text-sm font-bold hover:bg-blue-700 transition-colors"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
