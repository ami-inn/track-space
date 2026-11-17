
"use client";

import { useMemo } from "react";
import { SpacetimeDBProvider } from "spacetimedb/react";
import { DbConnection } from "@/src/module_bindings";

const HOST =
  process.env.NEXT_PUBLIC_SPACETIMEDB_HOST ??
  "ws://127.0.0.1:3000";

const DB_NAME =
  process.env.NEXT_PUBLIC_SPACETIMEDB_DB_NAME ??
  "find-my-friends";

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const connectionBuilder = useMemo(() => {
    const token =
      typeof window !== "undefined"
        ? sessionStorage.getItem("auth_token") ?? undefined
        : undefined;

    return DbConnection.builder()
      .withUri(HOST)
      .withDatabaseName(DB_NAME)
      .withToken(token)
      .withAutomaticReconnect()

      .onConnect((_conn, identity, token) => {
        console.log("✅ SpacetimeDB Connected!");
        console.log("Identity:", identity.toHexString());

        sessionStorage.setItem("auth_token", token);
      })

      .onConnectError((_ctx, error) => {
        console.error(
          "❌ SpacetimeDB Connection Error:",
          error
        );
      })

      .onDisconnect((_ctx, error) => {
        console.warn(
          "⚠️ SpacetimeDB Disconnected:",
          error
        );
      });
  }, []);

  return (
    <SpacetimeDBProvider
      connectionBuilder={connectionBuilder}
    >
      {children}
    </SpacetimeDBProvider>
  );
}
