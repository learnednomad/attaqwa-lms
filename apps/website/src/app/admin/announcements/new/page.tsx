import { AnnouncementForm } from '@/components/admin/AnnouncementForm';

export default function NewAnnouncementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Announcement</h1>
        <p className="text-gray-600 mt-2">
          Create a new announcement or event for the community.
        </p>
      </div>
      
      <AnnouncementForm />
    </div>
  );
}