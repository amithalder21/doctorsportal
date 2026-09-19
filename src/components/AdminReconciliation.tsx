'use client';

import { useState, useEffect } from 'react';

interface AuditLog {
  id: string;
  action: string;
  targetId: string;
  details: string | null;
  createdAt: string;
  admin: {
    name: string | null;
    email: string;
    role: string;
  };
}

interface ReconciliationData {
  totalPaidCollected: number;
  logs: AuditLog[];
}

export default function AdminReconciliation({ selectedDate }: { selectedDate: string }) {
  const [data, setData] = useState<ReconciliationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const url = selectedDate 
          ? `/api/admin/audit-logs?date=${selectedDate}`
          : '/api/admin/audit-logs';
        
        const response = await fetch(url);
        if (!response.ok) {
          if (response.status === 401) {
             // Not a SUPERADMIN, just fail silently or show a minimal message
             setError('Unauthorized');
             return;
          }
          throw new Error('Failed to fetch audit logs');
        }
        
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuditLogs();
  }, [selectedDate]);

  if (error === 'Unauthorized') {
    return null; // Don't show this section to non-superadmins
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="p-6 border-b border-gray-100 bg-salute-accent/30 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-salute-dark font-heading">Daily Reconciliation</h2>
          <p className="text-sm text-gray-500 mt-1">Audit log and financial summary for the selected date.</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Total PAID Today</p>
          <p className="text-3xl font-bold text-salute-primary">{data?.totalPaidCollected || 0}</p>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4">Audit Trail</h3>
        
        {!data?.logs || data.logs.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No activity logged for this date.</p>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {data.logs.map((log) => (
              <div key={log.id} className="flex gap-4 items-start p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <div className="mt-1">
                  {log.action.includes('PAYMENT_MARKED_PAID') ? (
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                  ) : log.action.includes('STATUS_CHANGED') ? (
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-salute-dark">
                    <span className="font-bold text-salute-primary">{log.admin.name || log.admin.email}</span> 
                    <span className="text-gray-500 text-xs ml-2 bg-gray-100 px-2 py-0.5 rounded-full">{log.admin.role}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {log.action.replace(/_/g, ' ')} for Appointment{' '}
                    <span className="font-mono text-xs bg-gray-100 px-1 rounded">
                      {log.targetId.startsWith('UIQ-') ? log.targetId : `#${log.targetId.slice(-6)}`}
                    </span>
                  </p>
                  {log.details && (
                    <p className="text-xs text-gray-400 mt-1">{log.details}</p>
                  )}
                </div>
                <div className="text-xs text-gray-400 whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
