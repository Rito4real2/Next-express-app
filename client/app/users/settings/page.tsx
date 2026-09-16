import ProfileForm from '@/components/ProfileForm';
import Navbar from '@/components/Navbar';

export default function UserSettingsPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Navbar />
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">User Settings</h1>
        <ProfileForm />
      </div>
    </div>
  );
}