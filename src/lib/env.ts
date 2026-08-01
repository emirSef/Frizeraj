import { z } from "zod";

/**
 * Runtime validation for environment variables.
 *
 * Client variables MUST be prefixed with `NEXT_PUBLIC_` and referenced
 * explicitly so Next.js can statically inline them into the client bundle.
 *
 * Validation is deferred until first access so `next build` can complete in
 * environments (e.g. Vercel) where env vars are injected at deploy time.
 */
const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
});

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

type ClientEnv = z.infer<typeof clientSchema>;
type ServerEnv = z.infer<typeof serverSchema>;
export type Env = ClientEnv & Partial<ServerEnv>;

/** Treat empty strings as "not set" so blank .env entries don't fail validation. */
function orUndefined(value: string | undefined): string | undefined {
  return value && value.length > 0 ? value : undefined;
}

function formatErrors(error: z.ZodError) {
  return error.issues.map((issue) => `  • ${issue.path.join(".")}: ${issue.message}`).join("\n");
}

function parseEnv(): Env {
  const parsedClient = clientSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: orUndefined(process.env.NEXT_PUBLIC_SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: orUndefined(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    NEXT_PUBLIC_APP_URL: orUndefined(process.env.NEXT_PUBLIC_APP_URL),
  });

  if (!parsedClient.success) {
    throw new Error(
      `❌ Invalid client environment variables:\n${formatErrors(parsedClient.error)}\n\nCheck your .env.local file (see .env.example).`,
    );
  }

  // Server variables are only parsed on the server to avoid leaking anything to the client bundle.
  if (typeof window !== "undefined") {
    return parsedClient.data;
  }

  const parsedServer = serverSchema.safeParse({
    SUPABASE_SERVICE_ROLE_KEY: orUndefined(process.env.SUPABASE_SERVICE_ROLE_KEY),
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!parsedServer.success) {
    throw new Error(`❌ Invalid server environment variables:\n${formatErrors(parsedServer.error)}`);
  }

  return {
    ...parsedClient.data,
    ...parsedServer.data,
  };
}

let cachedEnv: Env | undefined;

function getEnv(): Env {
  cachedEnv ??= parseEnv();
  return cachedEnv;
}

export const env: Env = new Proxy({} as Env, {
  get(_target, prop: keyof Env) {
    return getEnv()[prop];
  },
});
