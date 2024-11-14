import React from "react";
import GetImage from "../GetImage";
import MessageIndicator from "./MessageIndicator";
import Account from "./Account";
import useUnreadNotifications from "@/hooks/useUnreadNotifications";
import useUserData from "@/hooks/useUserData";

const Header = () => { 
  // const router = useRouter();
  const unreadCount = useUnreadNotifications();
  const { userRole } = useUserData();
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
         <div>
      {userRole === "admin" && (
        <div className="flex items-center">
          {unreadCount > 0 && (
            <span className=" bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center my-auto hover:cursor-help tooltip tooltip-left" data-tip="You have unread notifications">
              {unreadCount}
            </span>
          )}
        </div>
      )}
    </div>
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
