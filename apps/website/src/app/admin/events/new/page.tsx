import { EventForm } from '@/components/admin/EventForm';

export default function NewEventPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
        <p className="text-gray-600 mt-2">
          Create a new event for the community.
        </p>
      </div>
      
      <EventForm />
    </div>
  );
}