import React, { useState } from 'react';
import firebase from '../firebase';
import { saveFeedback } from '../services/firestoreService';
import { FeedbackIcon, CloseIcon } from './common/Icons';
import { t } from '../translations';

interface FeedbackProps {
  user: firebase.User;
}

const Feedback: React.FC<FeedbackProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    setError('');
    try {
      await saveFeedback(user.uid, user.email || 'anonymous', feedback);
      setFeedback('');
      setIsOpen(false);
      alert(t.feedbackSuccess);
    } catch (err: any) {
      setError(err.message || t.feedbackError);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 bg-teal-600 hover:bg-teal-700 text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-75 z-20"
        aria-label={t.sendFeedback}
      >
        <FeedbackIcon className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"
              aria-label="Close"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">{t.feedbackModalTitle}</h2>
            <form onSubmit={handleSubmit}>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={t.feedbackPlaceholder}
                rows={5}
                className="w-full p-3 bg-slate-100 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition text-slate-800 mb-4"
                required
              />
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !feedback.trim()}
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition disabled:bg-teal-300 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t.submitting : t.submitFeedback}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Feedback;
