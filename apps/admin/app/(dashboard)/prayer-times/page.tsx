/**
 * Iqamah Schedule Management Page
 * View and manage monthly iqamah times with date range support
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import { Clock, Plus, Pencil, Trash2, Save, X } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || '';

const MONTH_NAMES = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

interface IqamahSchedule {
  id: number;
  documentId?: string;
  month: number;
  dayRangeStart: number;
  dayRangeEnd: number;
  isDst: boolean;
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  jumuah1: string | null;
  jumuah2: string | null;
  isActive: boolean;
}

type EditForm = Omit<IqamahSchedule, 'id' | 'documentId'>;

const emptyForm: EditForm = {
  month: 1,
  dayRangeStart: 1,
  dayRangeEnd: 31,
  isDst: false,
  fajr: '',
  dhuhr: '',
  asr: '',
  maghrib: '+5',
  isha: '',
  jumuah1: null,
  jumuah2: null,
  isActive: true,
};

export default function PrayerTimesPage() {
  const [schedules, setSchedules] = useState<IqamahSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(emptyForm);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (API_TOKEN) headers['Authorization'] = `Bearer ${API_TOKEN}`;

  const fetchSchedules = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        'pagination[pageSize]': '100',
        'sort': 'month:asc,dayRangeStart:asc',
      });

      const res = await fetch(`${API_URL}/api/v1/iqamah-schedules?${params}`, { headers });
      if (res.ok) {
        const json = await res.json();
        const data = (json.data || []).map((item: IqamahSchedule & { attributes?: IqamahSchedule }) => ({
          id: item.id,
          documentId: item.documentId,
          ...(item.attributes || item),
        }));
        setSchedules(data);
      }
    } catch (error) {
      console.error('Failed to fetch iqamah schedules:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const filteredSchedules = schedules.filter(s => s.month === selectedMonth);

  const startEdit = (schedule: IqamahSchedule) => {
    setEditingId(schedule.id);
    setEditForm({
      month: schedule.month,
      dayRangeStart: schedule.dayRangeStart,
      dayRangeEnd: schedule.dayRangeEnd,
      isDst: schedule.isDst,
      fajr: schedule.fajr,
      dhuhr: schedule.dhuhr,
      asr: schedule.asr,
      maghrib: schedule.maghrib,
      isha: schedule.isha,
      jumuah1: schedule.jumuah1,
      jumuah2: schedule.jumuah2,
      isActive: schedule.isActive,
    });
    setIsCreating(false);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setEditForm({ ...emptyForm, month: selectedMonth });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setEditForm(emptyForm);
  };

  const saveSchedule = async () => {
    setSaving(true);
    try {
      if (isCreating) {
        const res = await fetch(`${API_URL}/api/v1/iqamah-schedules`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ data: editForm }),
        });
        if (!res.ok) throw new Error('Failed to create');
      } else if (editingId) {
        const schedule = schedules.find(s => s.id === editingId);
        const identifier = schedule?.documentId || editingId;
        const res = await fetch(`${API_URL}/api/v1/iqamah-schedules/${identifier}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ data: editForm }),
        });
        if (!res.ok) throw new Error('Failed to update');
      }
      cancelEdit();
      await fetchSchedules();
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save iqamah schedule. Check console for details.');
    } finally {
      setSaving(false);
    }
  };

  const deleteSchedule = async (schedule: IqamahSchedule) => {
    if (!confirm(`Delete iqamah entry for ${MONTH_NAMES[schedule.month]} ${schedule.dayRangeStart}-${schedule.dayRangeEnd}?`)) return;
    try {
      const identifier = schedule.documentId || schedule.id;
      const res = await fetch(`${API_URL}/api/v1/iqamah-schedules/${identifier}`, {
        method: 'DELETE',
        headers,
      });
      if (!res.ok) throw new Error('Failed to delete');
      await fetchSchedules();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const updateField = (field: keyof EditForm, value: string | number | boolean | null) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900 flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary-600" />
            Iqamah Schedule
          </h1>
          <p className="text-sm text-charcoal-600 mt-1">
            Manage monthly iqamah times for Masjid At-Taqwa. Adhan times come from Aladhan API automatically.
          </p>
        </div>
        <Button onClick={startCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Entry
        </Button>
      </div>

      {/* Month Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
              <button
                key={month}
                onClick={() => setSelectedMonth(month)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedMonth === month
                    ? 'bg-primary-600 text-white'
                    : 'bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200'
                }`}
              >
                {MONTH_NAMES[month].slice(0, 3)}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Form */}
      {isCreating && (
        <Card className="border-primary-300 bg-primary-50/30">
          <CardHeader>
            <CardTitle className="text-lg">New Iqamah Entry - {MONTH_NAMES[selectedMonth]}</CardTitle>
          </CardHeader>
          <CardContent>
            <ScheduleForm form={editForm} updateField={updateField} />
            <div className="flex gap-2 mt-4">
              <Button onClick={saveSchedule} disabled={saving} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button onClick={cancelEdit} variant="outline" className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedule Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{MONTH_NAMES[selectedMonth]} Iqamah Schedule</CardTitle>
          <CardDescription>
            {filteredSchedules.length} date range{filteredSchedules.length !== 1 ? 's' : ''} configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-charcoal-500">Loading...</div>
          ) : filteredSchedules.length === 0 ? (
            <div className="text-center py-8 text-charcoal-500">
              No iqamah entries for {MONTH_NAMES[selectedMonth]}. Click &quot;Add Entry&quot; to create one.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSchedules.map(schedule => (
                <div key={schedule.id} className="border border-charcoal-200 rounded-lg p-4">
                  {editingId === schedule.id ? (
                    <>
                      <ScheduleForm form={editForm} updateField={updateField} />
                      <div className="flex gap-2 mt-4">
                        <Button onClick={saveSchedule} disabled={saving} size="sm" className="flex items-center gap-1">
                          <Save className="h-3 w-3" />
                          {saving ? 'Saving...' : 'Save'}
                        </Button>
                        <Button onClick={cancelEdit} variant="outline" size="sm" className="flex items-center gap-1">
                          <X className="h-3 w-3" />
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-charcoal-900">
                            Days {schedule.dayRangeStart} - {schedule.dayRangeEnd}
                          </span>
                          {schedule.isDst && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">DST</span>
                          )}
                          {!schedule.isActive && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">Inactive</span>
                          )}
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 text-sm">
                          <div>
                            <span className="text-charcoal-500 block text-xs">Fajr</span>
                            <span className="font-medium">{schedule.fajr}</span>
                          </div>
                          <div>
                            <span className="text-charcoal-500 block text-xs">Dhuhr</span>
                            <span className="font-medium">{schedule.dhuhr}</span>
                          </div>
                          <div>
                            <span className="text-charcoal-500 block text-xs">Asr</span>
                            <span className="font-medium">{schedule.asr}</span>
                          </div>
                          <div>
                            <span className="text-charcoal-500 block text-xs">Maghrib</span>
                            <span className="font-medium">{schedule.maghrib}</span>
                          </div>
                          <div>
                            <span className="text-charcoal-500 block text-xs">Isha</span>
                            <span className="font-medium">{schedule.isha}</span>
                          </div>
                        </div>
                        {(schedule.jumuah1 || schedule.jumuah2) && (
                          <div className="mt-2 text-sm">
                            <span className="text-charcoal-500 text-xs">Jumu&apos;ah: </span>
                            <span className="font-medium">
                              {schedule.jumuah1}{schedule.jumuah2 ? ` / ${schedule.jumuah2}` : ''}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => startEdit(schedule)}
                          className="p-1.5 text-charcoal-500 hover:text-primary-600 hover:bg-primary-50 rounded"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteSchedule(schedule)}
                          className="p-1.5 text-charcoal-500 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ScheduleForm({
  form,
  updateField,
}: {
  form: EditForm;
  updateField: (field: keyof EditForm, value: string | number | boolean | null) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Input
          label="Day Start"
          type="number"
          min={1}
          max={31}
          value={form.dayRangeStart}
          onChange={e => updateField('dayRangeStart', parseInt(e.target.value) || 1)}
        />
        <Input
          label="Day End"
          type="number"
          min={1}
          max={31}
          value={form.dayRangeEnd}
          onChange={e => updateField('dayRangeEnd', parseInt(e.target.value) || 31)}
        />
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isDst}
              onChange={e => updateField('isDst', e.target.checked)}
              className="rounded border-charcoal-300"
            />
            DST
          </label>
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={e => updateField('isActive', e.target.checked)}
              className="rounded border-charcoal-300"
            />
            Active
          </label>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Input
          label="Fajr"
          value={form.fajr}
          onChange={e => updateField('fajr', e.target.value)}
          placeholder="6:30 AM"
        />
        <Input
          label="Dhuhr"
          value={form.dhuhr}
          onChange={e => updateField('dhuhr', e.target.value)}
          placeholder="1:00 PM"
        />
        <Input
          label="Asr"
          value={form.asr}
          onChange={e => updateField('asr', e.target.value)}
          placeholder="4:30 PM"
        />
        <Input
          label="Maghrib"
          value={form.maghrib}
          onChange={e => updateField('maghrib', e.target.value)}
          placeholder="+5"
          helperText="+N = minutes after adhan"
        />
        <Input
          label="Isha"
          value={form.isha}
          onChange={e => updateField('isha', e.target.value)}
          placeholder="8:00 PM"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Jumu'ah 1st Khutbah"
          value={form.jumuah1 || ''}
          onChange={e => updateField('jumuah1', e.target.value || null)}
          placeholder="1:15 PM"
        />
        <Input
          label="Jumu'ah 2nd Khutbah"
          value={form.jumuah2 || ''}
          onChange={e => updateField('jumuah2', e.target.value || null)}
          placeholder="2:15 PM"
        />
      </div>
    </div>
  );
}
