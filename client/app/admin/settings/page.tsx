import ProfileForm from '@/components/ProfileForm';
import Link from 'next/link';

export default function UserSettingsPage() {
  const adminLinks = [
    {
      title: 'Manage Users',
      description: 'View, edit, and manage user accounts and roles',
      href: '/users/manage',
      icon: '👥',
    },
    {
      title: 'Manage Transactions',
      description: 'Approve, reject, or delete deposits and withdrawals',
      href: '/users/manage/transactions',
      icon: '💳',
    },
    {
      title: 'Edit Admin Payment Details',
      description: 'Configure bank and crypto deposit addresses',
      href: '/admin/settings/payment-details',
      icon: '⚙️',
    },
    {
      title: 'Edit Admin Investment Details',
      description: 'Create and manage investment plan templates',
      href: '/admin/settings/admin-investment-plans',
      icon: '📈',
    },
    {
      title: 'Edit Admin Authorization Pin',
      description: 'Create and manage withdrawal pins',
      href: '/admin/settings/admin-auth-pin',
      icon: '📈',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 font-mono">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Admin Settings</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage system preferences and administrative controls.</p>
        </div>

        {/* Profile Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8">
          <ProfileForm />
        </div>

        {/* Admin Management Links Card */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Administrative Controls</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Quick access to backend management portals.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-100 hover:border-black transition-all group"
              >
                <span className="text-2xl p-2 bg-white rounded-lg border shadow-sm group-hover:scale-105 transition-transform shrink-0">
                  {link.icon}
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm group-hover:text-black">
                    {link.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    {link.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}