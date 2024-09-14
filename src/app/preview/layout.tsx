import WaterMark from "@/components/watermark";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <WaterMark />
    </>
  );
}
