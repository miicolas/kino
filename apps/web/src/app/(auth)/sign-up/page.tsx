import { SignUpForm } from "./_components/sign-up-form";

export const metadata = { title: "Sign up" };

export default function PageSignUp() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-6 px-4">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-2xl font-semibold">Create your account</h1>
          <p className="text-muted-foreground text-sm">
            Enter your details to get started.
          </p>
        </div>
        <SignUpForm />
        <p className="text-muted-foreground text-center text-sm">
          Already have an account?{" "}
          <a className="text-foreground underline-offset-4 hover:underline" href="/sign-in">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
