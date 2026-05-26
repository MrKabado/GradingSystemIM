import AppShell from "@/components/common/AppShell"

export default function PageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppShell>{children}</AppShell>
}
