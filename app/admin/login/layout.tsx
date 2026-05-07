import type { Metadata } from "next";
export const metadata: Metadata = { title: "Logg inn – Admin | Bokhandelen" };
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
