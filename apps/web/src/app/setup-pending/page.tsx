export const metadata = { title: "Server setup in progress" };

export default function SetupPendingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-2 px-4 text-center">
        <h1 className="font-semibold text-2xl">Server setup in progress</h1>
        <p className="text-muted-foreground text-sm">
          An administrator is currently configuring the server. Please check
          back later.
        </p>
      </div>
    </div>
  );
}
