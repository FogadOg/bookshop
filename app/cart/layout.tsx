import type { Metadata } from "next";
export const metadata: Metadata = { title: "Handlekurv | Bokhandelen" };
export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
