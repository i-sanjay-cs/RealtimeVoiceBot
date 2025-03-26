import { Header } from "@/components/header";
import { RoomComponent } from "@/components/room-component";
import { Auth } from "@/components/auth";
import LK from "@/components/lk";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Voice Assistant";
  const description = "";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default function Dashboard() {
  return (
    <div className="flex flex-col h-full bg-neutral-100">
      <header className="flex flex-shrink-0 h-12 items-center justify-between px-4 w-full md:mx-auto">
        <LK />
        <Auth />
      </header>
      <main className="flex flex-col flex-grow overflow-hidden p-0 md:p-2 md:pt-0 w-full md:mx-auto">
        <Header />
        <RoomComponent />
      </main>
      <footer className="flex items-center justify-center py-3 text-xs text-gray-600">
        Voice Assistant 2025
      </footer>
    </div>
  );
}
