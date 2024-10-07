import React from "react";
import Image from "next/image";
import { logoutAccount } from "@/lib/actions/user.action";
import { useRouter } from "next/navigation";

const Footer = async ({ user, type = "desktop" }: FooterProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    const loggedOut = await logoutAccount();
    if (loggedOut) {
      router.push("/sign-in");
    }
    //  logoutAccount() returns a value that can be tested for truthiness, such as a boolean indicating success or failure.

    //
  };
  return (
    <footer className="footer">
      <div className={type === "mobile" ? "footer_name-mobile" : "footer_name"}>
        <p className="text-xl font-bold text-gray-950">
          {user?.name[0].toUpperCase()}
        </p>
      </div>
      <div
        className={type === "mobile" ? "footer_email-mobile" : "footer_email"}
      >
        <h1 className=" ml-2 text-16 font-bold text-gray-950">{user?.name}</h1>
        <p className="text-14 truncate font-normal text-gray-800 ml-2">
          {user?.email}
        </p>
      </div>
      <div className="footer_image" onClick={handleLogout}>
        <Image
          src="/icons/logout.svg"
          alt="logout"
          height={36}
          width={36}
          className="rounded-full cursor-pointer hover:bg-gray-300"
        />
      </div>
    </footer>
  );
};

export default Footer;
