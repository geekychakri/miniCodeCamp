import { useState, useEffect, useRef } from "react";
import Link from "next/link";

import { User, LogOut, TrendingUp, GitHub } from "react-feather";
import { useClerk } from "@clerk/nextjs";

function Navbar() {
  const { user, signOut } = useClerk();

  const [dropDown, setDropDown] = useState(false);
  const [offline, setOffline] = useState(false);

  const dropDownRef = useRef(null);

  const displayDropDown = () => {
    setDropDown((prevState) => !prevState);
  };

  const handleClickOutside = (e) => {
    console.log(dropDownRef.current);
    if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
      setDropDown(false);
    }
  };

  const handleOffline = () => {
    setOffline(true);
    console.log("OFFLINE");
  };

  const handleOnline = () => {
    setOffline(false);
    console.log("ONLINE");
  };

  useEffect(() => {
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const DropDown = () => {
    return (
      <div className="dropdown" ref={dropDownRef}>
        <div className="dropdown__header" onClick={displayDropDown}>
          <img
            src={user.externalAccounts[0].avatarUrl}
            alt="profile-pic"
            className="dropdown__header-img"
            width="100%"
            height="100%"
          />
        </div>

        <div className={`dropdown__list ${dropDown ? "active" : ""}`}>
          <div className="dropdown__item">
            <Link href="/dashboard">
              <a className="dropdown__link" onClick={() => setDropDown(false)}>
                <TrendingUp />
                <span className="dropdown__link-text">Dashboard</span>
              </a>
            </Link>
          </div>

          <div className="dropdown__item">
            <Link href="/user">
              <a className="dropdown__link" onClick={() => setDropDown(false)}>
                <User />
                <span className="dropdown__link-text">Account</span>
              </a>
            </Link>
          </div>

          <div className="dropdown__item">
            <button
              className="dropdown__link btn"
              onClick={() => {
                signOut();
              }}
            >
              <LogOut />
              <span className="dropdown__link-text">Sign out</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <nav className="navigation">
      <Link href="/">
        <a className="navigation__logo">
          <img src="/images/logo.png" width="60" height="60" alt="logo" />
          <span className="navigation__logo--main">mini</span>
          <span className="navigation__logo--sub">CodeCamp</span>
        </a>
      </Link>
      <div className="navigation__links">
        {!user && (
          <Link href="/sign-in">
            <a className="navigation__login">
              <GitHub />
              <span style={{ marginLeft: "8px" }}>Sign In</span>
            </a>
          </Link>
        )}
        {user && (
          <div className="navigation__auth">
            <Link href="/courses">
              <a className="navigation__courses">
                <span>{offline ? "Offline" : "Courses"}</span>
              </a>
            </Link>
            <DropDown />
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
