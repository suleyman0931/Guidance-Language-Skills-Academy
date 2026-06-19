'use client';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';

export default function DebugPage() {
  const { user, token, isAdmin, hydrate } = useAuthStore();
  const [localStorageData, setLocalStorageData] = useState<any>(null);

  useEffect(() => {
    hydrate();
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('ga_user');
      const storedToken = localStorage.getItem('ga_token');
      setLocalStorageData({
        user: storedUser ? JSON.parse(storedUser) : null,
        token: storedToken,
      });
    }
  }, [hydrate]);

  return (
    <div className="min-h-screen p-8" style={{ background: '#0D1B4B' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">🔍 Debug Info</h1>

        {/* Zustand Store State */}
        <div className="glass p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">📦 Zustand Store State</h2>
          <div className="space-y-3">
            <div>
              <span className="text-white/50 text-sm">isAdmin:</span>
              <span className={`ml-2 font-bold ${isAdmin ? 'text-green-400' : 'text-red-400'}`}>
                {isAdmin ? '✅ true' : '❌ false'}
              </span>
            </div>
            <div>
              <span className="text-white/50 text-sm">user:</span>
              <pre className="bg-black/30 p-3 rounded mt-2 text-xs text-white overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
            <div>
              <span className="text-white/50 text-sm">token exists:</span>
              <span className={`ml-2 font-bold ${token ? 'text-green-400' : 'text-red-400'}`}>
                {token ? '✅ yes' : '❌ no'}
              </span>
            </div>
          </div>
        </div>

        {/* LocalStorage Data */}
        <div className="glass p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">💾 LocalStorage Data</h2>
          <div className="space-y-3">
            <div>
              <span className="text-white/50 text-sm">ga_user:</span>
              <pre className="bg-black/30 p-3 rounded mt-2 text-xs text-white overflow-auto">
                {JSON.stringify(localStorageData?.user, null, 2)}
              </pre>
            </div>
            <div>
              <span className="text-white/50 text-sm">ga_token:</span>
              <pre className="bg-black/30 p-3 rounded mt-2 text-xs text-white overflow-auto break-all">
                {localStorageData?.token || 'null'}
              </pre>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="glass p-6">
          <h2 className="text-xl font-bold text-white mb-4">⚡ Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="px-6 py-3 rounded-lg font-bold text-white bg-red-500 hover:bg-red-600 transition-all">
              🗑️ Clear LocalStorage & Reload
            </button>
            <p className="text-white/50 text-sm">
              This will log you out and clear all stored data
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="glass p-6 mt-6" style={{ background: 'rgba(196,168,79,0.1)', border: '1px solid rgba(196,168,79,0.3)' }}>
          <h2 className="text-xl font-bold mb-3" style={{ color: '#C4A84F' }}>📋 What to Check</h2>
          <ul className="text-white/70 text-sm space-y-2">
            <li>✓ Does the user object have <code className="bg-black/30 px-2 py-1 rounded">is_admin</code> field?</li>
            <li>✓ Is <code className="bg-black/30 px-2 py-1 rounded">is_admin</code> set to <code className="bg-black/30 px-2 py-1 rounded">true</code>?</li>
            <li>✓ If not, you need to:</li>
            <li className="ml-6">1. Deploy backend on Render (to add AuthController)</li>
            <li className="ml-6">2. Clear localStorage above</li>
            <li className="ml-6">3. Login again with admin credentials</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
