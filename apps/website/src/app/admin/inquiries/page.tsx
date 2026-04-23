'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Inbox,
  MessageCircleQuestion,
  RefreshCcw,
  AlertCircle,
  CheckCircle2,
  Clock,
  Archive,
  Mail,
  Phone,
} from 'lucide-react';

type InquiryType = 'contact' | 'legal';
type InquiryStatus = 'new' | 'in-progress' | 'responded' | 'answered' | 'archived';

interface ContactInquiry {
  id: number;
  documentId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  subject?: string;
  category?: string;
  audience?: string;
  language?: string;
  message?: string;
  question?: string;
  preferredContact?: string;
  status: InquiryStatus;
  submittedAt?: string;
  createdAt?: string;
}

const STATUS_META: Record<InquiryStatus, { label: string; tone: string; icon: typeof Clock }> = {
  new: { label: 'New', tone: 'bg-blue-100 text-blue-700', icon: Clock },
  'in-progress': {
    label: 'In progress',
    tone: 'bg-amber-100 text-amber-700',
    icon: Clock,
  },
  responded: {
    label: 'Responded',
    tone: 'bg-emerald-100 text-emerald-700',
    icon: CheckCircle2,
  },
  answered: {
    label: 'Answered',
    tone: 'bg-emerald-100 text-emerald-700',
    icon: CheckCircle2,
  },
  archived: { label: 'Archived', tone: 'bg-gray-100 text-gray-600', icon: Archive },
};

export default function AdminInquiriesPage() {
  const [tab, setTab] = useState<InquiryType>('contact');
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchInquiries = async (type: InquiryType) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/inquiries?type=${type}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setInquiries(Array.isArray(json?.data) ? json.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inquiries');
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchInquiries(tab);
  }, [tab]);

  const updateStatus = async (
    inquiry: ContactInquiry,
    nextStatus: InquiryStatus
  ) => {
    const id = inquiry.documentId ?? String(inquiry.id);
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/inquiries/${tab}/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { status: nextStatus } }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fetchInquiries(tab);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: inquiries.length };
    for (const inq of inquiries) {
      c[inq.status] = (c[inq.status] || 0) + 1;
    }
    return c;
  }, [inquiries]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inquiries</h1>
          <p className="text-gray-600 mt-2 text-sm">
            Submissions from the public contact form and the Ask-an-Imam form.
            Status changes here also reflect in the Strapi admin.
          </p>
        </div>
        <Button
          onClick={() => fetchInquiries(tab)}
          disabled={loading}
          variant="outline"
          className="gap-2"
        >
          <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(
          [
            ['contact', 'Contact Form', Inbox],
            ['legal', 'Ask an Imam', MessageCircleQuestion],
          ] as Array<[InquiryType, string, typeof Inbox]>
        ).map(([key, label, Icon]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors flex items-center gap-2 ${
              tab === key
                ? 'border-islamic-green-600 text-islamic-green-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
            <span className="text-xs text-gray-400">({counts.all || 0})</span>
          </button>
        ))}
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50/40">
          <CardContent className="py-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-700">
                Could not load inquiries
              </p>
              <p className="text-xs text-red-600 mt-1">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-base">
              {tab === 'contact' ? 'Contact form submissions' : 'Ask-an-Imam questions'}
            </span>
            <span className="text-xs text-gray-400 font-normal">
              Showing {inquiries.length} most recent
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading && inquiries.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-sm">Loading…</div>
          ) : inquiries.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-sm">
              No submissions yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {inquiries.map((inq) => (
                <InquiryRow
                  key={inq.id}
                  inquiry={inq}
                  type={tab}
                  onUpdate={updateStatus}
                  isUpdating={updating === (inq.documentId ?? String(inq.id))}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InquiryRow({
  inquiry,
  type,
  onUpdate,
  isUpdating,
}: {
  inquiry: ContactInquiry;
  type: InquiryType;
  onUpdate: (inq: ContactInquiry, status: InquiryStatus) => void;
  isUpdating: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const meta = STATUS_META[inquiry.status] ?? STATUS_META.new;
  const StatusIcon = meta.icon;
  const nextStatuses: InquiryStatus[] =
    type === 'legal' ? ['answered', 'in-progress', 'archived'] : ['responded', 'in-progress', 'archived'];

  const submitted =
    inquiry.submittedAt || inquiry.createdAt
      ? new Date(inquiry.submittedAt || inquiry.createdAt!).toLocaleString()
      : '—';

  const headline = type === 'legal' ? inquiry.category : inquiry.subject;
  const body = type === 'legal' ? inquiry.question : inquiry.message;

  return (
    <div className="p-4">
      <button
        type="button"
        onClick={() => setExpanded((x) => !x)}
        className="w-full flex items-start justify-between gap-4 text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-gray-900">
              {inquiry.firstName} {inquiry.lastName}
            </span>
            <Badge className={`${meta.tone} gap-1 inline-flex`}>
              <StatusIcon className="h-3 w-3" />
              {meta.label}
            </Badge>
            {headline && (
              <Badge variant="outline" className="text-xs">
                {headline}
              </Badge>
            )}
            {type === 'legal' && inquiry.audience && (
              <Badge variant="outline" className="text-xs capitalize">
                {inquiry.audience}
              </Badge>
            )}
            {type === 'legal' && inquiry.language && (
              <Badge variant="outline" className="text-xs capitalize">
                {inquiry.language}
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-600 truncate">{body}</p>
          <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {inquiry.email}
            </span>
            {inquiry.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {inquiry.phone}
              </span>
            )}
            <span>{submitted}</span>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="mt-4 pl-1 space-y-4">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{body}</p>
          {type === 'contact' && inquiry.preferredContact && (
            <p className="text-xs text-gray-500">
              Preferred contact method:{' '}
              <span className="font-medium">{inquiry.preferredContact}</span>
            </p>
          )}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
            <a
              href={`mailto:${inquiry.email}?subject=Re:%20${encodeURIComponent(
                headline ?? 'Your inquiry'
              )}`}
              className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
            >
              <Mail className="h-3 w-3" />
              Reply by email
            </a>
            {inquiry.phone && (
              <a
                href={`tel:${inquiry.phone.replace(/\D/g, '')}`}
                className="inline-flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
              >
                <Phone className="h-3 w-3" />
                Call
              </a>
            )}
            <span className="flex-1" />
            {nextStatuses
              .filter((s) => s !== inquiry.status)
              .map((status) => {
                const m = STATUS_META[status];
                return (
                  <button
                    key={status}
                    type="button"
                    disabled={isUpdating}
                    onClick={() => onUpdate(inquiry, status)}
                    className={`text-xs px-3 py-1.5 rounded-md border transition-colors disabled:opacity-50 ${m.tone} hover:opacity-80`}
                  >
                    Mark as {m.label.toLowerCase()}
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
