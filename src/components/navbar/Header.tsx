import React, {  } from "react";
import { useRouter } from "next/navigation";
import GetImage from "../GetImage";
import MessageIndicator from "./MessageIndicator";
import Account from "./Account";

const Header = () => { 
  const router = useRouter();
  // const handleSignOut = async () => {
  //   await auth.signOut();
  //   router.push("/sign-in");
  // };

  return (
    <span className="w-full h-14 bg-gray-100 justify-between px-5 items-center border-b border-gray-300 hidden md:flex">
      <div className="flex items-center gap-4 ml-auto">
        <MessageIndicator />
        {/* <button
          className="btn btn-xs btn-error btn-outline rounded-none"
          onClick={handleSignOut}
        >
          <h1>Sign Out</h1>
        </button> */}
        <details className="dropdown dropdown-end">
          <summary
            tabIndex={0}
            role="button"
            className="h-10 w-10 flex items-center justify-center overflow-hidden custom-shadow border-zinc-700 border bg-white rounded-full"
          >
            <div className="width-[40px]">
              <GetImage storageLink="settings/brgyLogo" />
            </div>
          </summary>
          <Account/>
        </details>
      </div>
    </span>
  );
};

export default Header;
