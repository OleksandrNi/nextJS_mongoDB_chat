import React, { useState } from "react";
import { useWindowSize } from "../../hooks";
import { WindowSize } from "../../types";
import {
  CloseButtonContainer,
  CloseIcon,
  MenuIcon,
  MenuLinkContainer,
  Nav,
  NavLinkContainer,
  OverlayMenu,
} from "./NavElements";

import NavLink from "./NavLink";
import { signOut, useSession } from "next-auth/react";
import { BsFillPersonFill } from "react-icons/bs";
import Button from "../Button";

const Navbar = () => {
  const size: WindowSize = useWindowSize();
  const [showMenu, setShowMenu] = useState(false);
  const { data: session } = useSession();

  const openMenu = () => {
    setShowMenu(true);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  return (
    <Nav>
      <NavLinkContainer>
        {size.width > 768 ? (
          <>
            <NavLink route="/">Home</NavLink>
            <NavLink route="/products">Products</NavLink>

            {session ? (
              <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>

              <NavLink route="/profile">
                <BsFillPersonFill size={30} />
              </NavLink>
              <Button title="Logout" onClick={signOut} />
              </div>
            ) : (
              <NavLink route="/login">Login</NavLink>
            )}
          </>
        ) : (
          <MenuIcon size={30} onClick={openMenu} />
        )}
      </NavLinkContainer>

      {showMenu && (
        <OverlayMenu>
          <CloseButtonContainer>
            <CloseIcon size={40} color={"white"} onClick={closeMenu} />
          </CloseButtonContainer>
          <MenuLinkContainer>
            <NavLink route="/" large color="white" onClick={closeMenu}>
              Home
            </NavLink>
            <NavLink route="/products" large color="white" onClick={closeMenu}>
              Products
            </NavLink>
            
            {session ? (
              <div>
                <NavLink route="/profile" large color="white" onClick={closeMenu}>Profile</NavLink>
                <Button title="Logout" onClick={signOut} />
              </div>
            ) : (
              <NavLink route="/login" large color="white" onClick={closeMenu}>
                Login
              </NavLink>
            )}
          </MenuLinkContainer>
        </OverlayMenu>
      )}
    </Nav>
  );
};

export default Navbar;
