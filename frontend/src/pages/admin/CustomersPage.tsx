// FILE: frontend/src/pages/admin/CustomersPage.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useUsers } from '@/hooks/useUsers';
import { useDebounce } from '@/hooks/useDebounce';
import { getInitials, getLoyaltyTierBadge } from '@/lib/utils';
import type { User } from '@/types';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const CustomersPage = () => {
  const navigate = useNavigate();
  const [searchRaw, setSearchRaw] = useState('');
  const search = useDebounce(searchRaw, 400);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useUsers({
    search,
    role: 'CUSTOMER',
    page,
    limit: 15,
  });
  const users = data?.data || [];
  const meta = data?.meta;

  const columns = [
    {
      key: 'name',
      header: 'Customer',
      cell: (u: User) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue text-xs font-bold shrink-0">
            {u.avatar ? (
              <img
                src={u.avatar}
                alt=""
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getInitials(u)
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-white">
              {u.firstName} {u.lastName}
            </p>
            <p className="text-xs text-white/40">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      cell: (u: User) => (
        <span className="text-sm text-white/60">{u.phone || '—'}</span>
      ),
    },
    {
      key: 'loyaltyTier',
      header: 'Loyalty',
      cell: (u: User) => (
        <Badge className={cn('border', getLoyaltyTierBadge(u.loyaltyTier))}>
          {u.loyaltyTier}
        </Badge>
      ),
    },
    {
      key: '_count',
      header: 'Bookings',
      cell: (u: User) => (
        <span className="text-white font-medium">
          {u._count?.bookings || 0}
        </span>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      cell: (u: User) => (
        <Badge
          className={
            u.isActive
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }
        >
          {u.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-header">Customers</h1>
        <p className="page-subheader">
          {meta ? `${meta.total} registered customers` : 'Loading...'}
        </p>
      </div>

      <div className="glass-card rounded-2xl">
        <div className="p-4 border-b border-white/5">
          <div className="max-w-sm">
            <Input
              placeholder="Search by name, email, phone..."
              leftIcon={<Search className="w-4 h-4" />}
              value={searchRaw}
              onChange={(e) => {
                setSearchRaw(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
        <div className="p-4">
          <DataTable
            data={users}
            columns={columns}
            loading={isLoading}
            onRowClick={(u) => navigate(`/admin/customers/${u.id}`)}
            keyExtractor={(u) => u.id}
            emptyTitle="No customers found"
            emptyDescription="No customers match your search."
          />
        </div>
        {meta && meta.totalPages > 1 && (
          <div className="p-4 border-t border-white/5 flex justify-center gap-2">
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
              (p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    'w-8 h-8 rounded-lg text-sm font-medium transition-all',
                    p === page
                      ? 'bg-brand-blue text-white'
                      : 'text-white/40 hover:text-white hover:bg-white/10',
                  )}
                >
                  {p}
                </button>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomersPage;
