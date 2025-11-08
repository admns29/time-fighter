import React, { useState, useEffect } from 'react';

const CategoryModal = ({ isOpen, onClose, onSave, categoryToEdit = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    color: '#3B82F6',
    icon: '📚',
    defaultGoalDuration: 60 // Default 60 minutes
  });

  // Populate form when editing
  useEffect(() => {
    if (categoryToEdit) {
      setFormData({
        name: categoryToEdit.name,
        color: categoryToEdit.color || '#3B82F6',
        icon: categoryToEdit.icon || '📚',
        defaultGoalDuration: categoryToEdit.defaultGoalDuration
          ? Math.floor(categoryToEdit.defaultGoalDuration / 60)
          : 60
      });
    } else {
      // Reset form when creating new
      setFormData({
        name: '',
        color: '#3B82F6',
        icon: '📚',
        defaultGoalDuration: 60
      });
    }
  }, [categoryToEdit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert minutes to seconds for backend
    const dataToSend = {
      ...formData,
      defaultGoalDuration: formData.defaultGoalDuration * 60
    };

    onSave(dataToSend);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'defaultGoalDuration' ? parseInt(value) || 0 : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent mb-6">
          {categoryToEdit ? 'Edit Category' : 'Add New Category'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Name */}
          <div>
            <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">
              Category Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., React, Machine Learning"
              className="w-full bg-slate-100 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Icon */}
          <div>
            <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">
              Icon (Emoji)
            </label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              placeholder="📚"
              maxLength="2"
              className="w-full bg-slate-100 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-2xl focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Tip: Copy an emoji from emojipedia.org</p>
          </div>

          {/* Color */}
          <div>
            <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">
              Color
            </label>
            <div className="flex gap-3">
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="h-10 w-20 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded cursor-pointer"
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                placeholder="#3B82F6"
                className="flex-1 bg-slate-100 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          {/* Default Goal Duration */}
          <div>
            <label className="block text-gray-600 dark:text-gray-400 text-sm mb-2">
              Default Goal (minutes)
            </label>
            <input
              type="number"
              name="defaultGoalDuration"
              value={formData.defaultGoalDuration}
              onChange={handleChange}
              min="1"
              placeholder="60"
              className="w-full bg-slate-100 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold py-2 px-4 rounded-lg transition-all shadow-lg hover:shadow-cyan-500/50"
            >
              {categoryToEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;