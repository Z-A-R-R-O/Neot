import { PublicHeader } from "@/components/layout/public-header";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <PublicHeader />
      {children}
    </>
  );
}
