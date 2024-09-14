import GetEmbed from "@/components/get-embed";
import UserProvider from "@/components/provider/user-provider";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <UserProvider>
        {children}
        <GetEmbed />
      </UserProvider>
    </>
  );
}
