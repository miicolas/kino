import { SignInForm } from "./_components/sign-in-form";

export const metadata = { title: "Sign in" };

export default function PageSignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-6 px-4">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-2xl font-semibold">Sign in to your account</h1>
          <p className="text-muted-foreground text-sm">
            Enter your email and password to continue.
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}
