import ProfileForm from '@/components/ProfileForm';
import Link from 'next/link';

export default function UserSettingsPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Settings</h1>
        <ProfileForm />
      </div>
      <div className="bg-white rounded-lg border shadow-sm p-6 flex flex-col justify-between items-start mt-2.5">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Admin User Settings</h2>
          <button>
            <Link href="/users/manage" className="text-black-600 hover:underline text-sm">
              Manage Users
            </Link>
          </button>

          <button>
            <Link href="/users/manage/transactions" className="text-black-600 hover:underline text-sm">
              Manage Transactions
            </Link>
          </button>

          <button>
            <Link href="/admin/settings/payment-details" className="text-black-600 hover:underline text-sm">
              Edit Admin Payment Details
            </Link>
          </button>
        </div>
    </div>
  );
}