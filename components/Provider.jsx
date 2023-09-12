'use client'

import { SessionProvider } from "next-auth/react";

function Provider({ children, session }) {
  return <SessionProvider {...{ session }}>{children}</SessionProvider>;
}

export default Provider;
