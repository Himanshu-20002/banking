import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import MobileNav from "@/components/MobileNav";
export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const loggedIn={firstName:'john',lastName:'doe'};


    return (
      <main className="flex h-screen w-full font-inter">
        <Sidebar user={loggedIn}/>
        <div className="flex size-full flex-col ">
          <div className="root-layout">
            <Image src="/icons/logo.svg" alt="logo" width={32} height={32}/>
            <div>
              <MobileNav user={loggedIn}/>
            </div>
          </div>

        {children}
        </div>
        </main>
  
    );
  }