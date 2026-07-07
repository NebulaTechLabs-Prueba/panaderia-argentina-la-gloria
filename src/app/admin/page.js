import { AdminPanel } from "@/modules/admin/AdminPanel";

// Panel de gestión (subdominio "admin" a futuro). Por ahora vive como ruta /admin
// dentro del mismo proyecto estático y con datos SIMULADOS (sin backend).
export const metadata = {
  title: "Panel de gestión · La Gloria",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminPanel />;
}
