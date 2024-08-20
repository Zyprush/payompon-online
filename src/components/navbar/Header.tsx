import React, { useState } from 'react';
import { IoLogoSlack } from 'react-icons/io';
import Account from './Account';

const Header = () => {
    const [userData, setUserData] = useState<any>(null);
    const [showNotif, setShowNotif] = useState<boolean>(false);

    return (
        <span className="w-full h-14 bg-gray-100 justify-between px-5 items-center border-b border-gray-300 hidden md:flex">
            <div className="flex items-center gap-4 ml-auto">
                <details className="dropdown dropdown-end">
                    <summary
                        tabIndex={0}
                        role="button"
                        className="h-10 w-10 flex items-center justify-center overflow-hidden border-2 border-primary bg-primary rounded-full"
                    >
                        {/* <img
                            src={userData?.profilePicUrl || "/img/profile-admin.jpg"}
                            alt="profile"
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                        /> */}
                    </summary>
                    <Account userData={userData} />
                </details>
            </div>
        </span>
    );
}

export default Header;
