import { Toaster } from 'sonner';
import { DashboardLayout} from '@/components/layouts/DashboardLayout';

export default function LayoutDashboard({ children }: { children: React.ReactNode }) {
   return (
      <>
         <DashboardLayout>
            {children}
         </DashboardLayout>
         <Toaster position="top-right" richColors />
      </>
   );
}
