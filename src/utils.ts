// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function clean(args: Record<string, any>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(args).filter(([, v]) => v != null && v !== ''),
  );
}
