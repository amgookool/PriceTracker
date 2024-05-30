import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createLazyFileRoute } from "@tanstack/react-router";
import { MdOutlineWarningAmber } from "react-icons/md";
import { useForm } from "@tanstack/react-form";
import type { FieldApi } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

export const Route = createLazyFileRoute("/login")({
  component: Login,
});

function Login() {
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value);
    },
    // Add a validator to support Zod usage in Form and Field
    validatorAdapter: zodValidator,
  });
  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-sm h-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your username and password to sign in
            </CardDescription>
          </CardHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <form.Field
                  name="username"
                  validators={{
                    onChange: z.string().min(1, "*Username is required"),
                    onChangeAsyncDebounceMs: 500,
                    onChangeAsync: z.string().refine(
                      async (value) => {
                        await new Promise((resolve) =>
                          setTimeout(resolve, 1000)
                        );
                        return !value.includes("error");
                      },
                      {
                        message: "No 'error' allowed in username",
                      }
                    ),
                  }}
                  children={(field) => {
                    return (
                      <>
                        <Label htmlFor={field.name}>Username</Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          type="text"
                          placeholder="Enter username..."
                        />
                        <span className={"flex text-xs text-red-600"}>
                          <FieldInfo field={field} />
                        </span>
                      </>
                    );
                  }}
                />
              </div>

              <div className="grid gap-2">
                <form.Field
                  name="password"
                  validators={{
                    onChange: z.string().min(1, "*Password is required"),
                    onChangeAsyncDebounceMs: 500,
                    onChangeAsync: z.string().refine(
                      async (value) => {
                        await new Promise((resolve) =>
                          setTimeout(resolve, 1000)
                        );
                        return !value.includes("error");
                      },
                      {
                        message: "No 'error' allowed in password",
                      }
                    ),
                  }}
                  children={(field) => {
                    return (
                      <>
                        <Label htmlFor={field.name}>Password</Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          type="password"
                          placeholder="Enter password..."
                        />
                        <span className={"flex text-xs text-red-600"}>
                          <FieldInfo field={field} />
                        </span>
                      </>
                    );
                  }}
                />
              </div>
            </CardContent>
            <CardFooter>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full"
                  >
                    {isSubmitting ? "..." : "Sign In"}
                  </Button>
                )}
              />
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <>
      {field.state.meta.touchedErrors ? (
        <em>{field.state.meta.touchedErrors}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}
