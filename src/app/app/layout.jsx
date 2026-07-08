import SidebarLayout from "@/components/layout/SidebarLayout";
export default function AppLayout({ children }) {
  return (
    <div className="app-wrapper flex min-h-screen">
      <div className="flex-1 flex flex-col">
        <SidebarLayout>
            {children}
        </SidebarLayout>
      </div>
    </div>
  );
}