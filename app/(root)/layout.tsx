import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import MobileNav from "@/components/MobileNav";
import { getLoggedInUser } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";


export default async function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const loggedIn = await getLoggedInUser();
    // if(!loggedIn) redirect('/sign-in')
    console.log(loggedIn)


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