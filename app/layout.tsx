import "./globals.css";
import MenuBar from "@/components/MenuBar";
import TextInput from "@/components/TextInput";

export const metadata = {
  title: "ChatGPT",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-safe-h-screen scrollbar-hide flex flex-col bg-base-200">
        {/* <div className="fixed top-0 h-10 w-full bg-gradient-to-b from-base-200 via-base-200 to-transparent" /> */}
        {/* <div className="fixed bottom-0 h-10 w-full bg-gradient-to-b from-transparent via-base-200 to-base-200" /> */}
        <MenuBar />
        <div className="flex-grow" />
        <main className="flex justify-center">{children}</main>
        <TextInput />
      </body>
    </html>
  );
}
