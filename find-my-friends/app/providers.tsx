'use client';
import { useMemo } from "react";
import { SpacetimeDBProvider } from "spacetimedb/react";
import { DbConnection } from "@/src/module_bindings";


const HOST = process.env.NEXT_PUBLIC_SPACETIMEDB_HOST ?? 'wss://localhost:3000';
const DB_NAME = process.env.NEXT_PUBLIC_SPACETIMEDB_DB_NAME ?? 'nextjs-ts';

export function Providers({ children }: { children: React.ReactNode }) {
  const connectionBuilder = useMemo(
    () =>
      DbConnection.builder()
        .withUri(HOST)
        .withDatabaseName(DB_NAME)
        // sessionstorage (not localstorage) so every browser tab gets its own session
        // is is own identity - tis own friens on the map
      .withToken(sessionStorage.getItem('auth_token') || undefined)
      .onConnect((_conn,_identity,token) => {
        console.log('Connected with token:', token);
        sessionStorage.setItem('auth_token', token);
      } )
    ,
    []
  );

  return (
    <SpacetimeDBProvider connectionBuilder={connectionBuilder}>
      {children}
    </SpacetimeDBProvider>
  );
}