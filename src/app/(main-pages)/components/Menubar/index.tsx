import React from 'react';

import { NavbarMobile } from '../NavbarMobile';
import { MenubarDesktop } from './MenuBarDesktop';

export const Menubar = () => {
  return (
    <>
      <MenubarDesktop />
      <NavbarMobile />
    </>
  );
};
