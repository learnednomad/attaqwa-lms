import { AdminLayout } from '@/components/admin/AdminLayout';
import { AuthProvider } from '@/lib/hooks/useAuth';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminLayout>{children}</AdminLayout>
    </AuthProvider>
  );
}
