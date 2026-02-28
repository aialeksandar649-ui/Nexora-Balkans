import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import SEO from '../components/SEO';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/admin', { replace: true });
      return;
    }
    let cancelled = false;
    supabase?.rpc('admin_get_contact_submissions')
      .then(({ data, error: err }) => {
        if (!cancelled) {
          if (err) {
            setError(err.message);
            setSubmissions([]);
          } else {
            setSubmissions(Array.isArray(data) ? data : []);
          }
        }
      })
      .catch((e) => {
        if (!cancelled) setError(String(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [user, navigate]);

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-2 border-[#FF385C] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error && submissions.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Admin Access</h1>
          <p className="text-red-500 mb-4">{error}</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
            Only admins can access this page. Add your user ID to the admin_users table in Supabase.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-[#FF385C] text-white rounded-lg font-medium"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEO title="Admin" description="Admin dashboard" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Admin Dashboard</h1>
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Contact Submissions</h2>
          {submissions.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No submissions yet.</p>
          ) : (
            <div className="space-y-4">
              {submissions.map((s) => (
                <div
                  key={s.id}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{s.name}</span>
                      <span className="text-gray-500 dark:text-gray-400 mx-2">•</span>
                      <span className="text-gray-600 dark:text-gray-300">{s.email}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(s.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">{s.subject}</p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-1 whitespace-pre-wrap">{s.message}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
