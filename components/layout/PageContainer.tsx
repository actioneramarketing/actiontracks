export function PageContainer({
  children,
  className = "",
  wide = false,
}: {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <main
      className={`mx-auto flex-1 px-4 py-8 sm:px-6 ${wide ? "max-w-7xl" : "max-w-6xl"} ${className}`}
    >
      {children}
    </main>
  );
}
