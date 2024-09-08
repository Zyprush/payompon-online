import { auth } from "@/firebase";
import { getUserData } from "@/helper/getUser";
import { UserDataInterface } from "@/helper/interface";
import Image from "next/image";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const Verify: FC = () => {
  const [user, loading] = useAuthState(auth); // Get the current authenticated user
  const [userData, setUserData] = useState<UserDataInterface | null>(null);

  useEffect(() => {
    if (user) {
      getUserData(user.uid).then((data) => {
        setUserData(data); // Set the fetched data into the state
      });
    }
  }, [user]);

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div>
        {userData?.submitted == "submitted" && userData?.verified ? (
          <div className="flex gap-5 md:max-w-[23rem]">
            <Image
              src="/img/rabbit.png"
              alt="verified.png"
              className="h-auto w-20 my-auto"
              height={100}
              width={100}
            />
            <div className="flex flex-col">
              <h1 className="text-primary text-sm font-semibold -mb-2">
                Welcome
              </h1>
              <h1 className="text-primary text-lg font-semibold mt-0 mb-auto">
                {userData?.name}
              </h1>
              <div className="text-xs text-zinc-500 text-wrap">
                Your account is successfully verified. You now have access to
                various services.
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-5 md:max-w-[23rem]">
            <Image
              src="/img/fox.png"
              alt="verified.png"
              className="h-auto w-20 my-auto"
              height={100}
              width={100}
            />
            <div className="flex flex-col items-start justify-center">
              <h1 className="text-primary font-bold">
                <span className=""> Hello</span> {userData?.name}
              </h1>
              <div className="text-xs text-zinc-500 text-wrap">
                <p className="">
                  Account not fully verified. No access to services.If you
                  receive a message regarding your account verfication, please
                  visit barangay hall with valid ID to verify account.
                </p>
                <Link
                  className="underline block"
                  href="https://governmentph.com/list-valid-id-in-the-philippines/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  list of valid id
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;
