import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import SidebarLayout from "@/components/layout/SidebarLayout";
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <ThemeProvider>
            <SidebarLayout>
              {children}
            </SidebarLayout>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
