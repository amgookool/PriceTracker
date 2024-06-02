import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addProductApi, getAllUsersProductsApi } from "@/lib/api";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { FaPlus } from "react-icons/fa";
// import ProductCard from "@/components/ProductCard";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";
import { toast } from "sonner";

export const Route = createLazyFileRoute("/_dashboard/_auth/products")({
  component: Products,
});

function Products() {
  const getAllUsersProductsQueryOpts = queryOptions({
    queryKey: ["get-all-products"],
    queryFn: getAllUsersProductsApi,
    staleTime: 1000 * 60 * 5,
  });

  const { data, isPending, error, isError } = useQuery(
    getAllUsersProductsQueryOpts
  );

  const user_id = JSON.parse(localStorage.getItem("auth") || "").userId;
  const mutation = useMutation({
    mutationFn: addProductApi,
    onSuccess: (res) => {
      console.log(res);
      toast.success("Logged in successfully");
    },
    onError: (error) => {
      console.error("An error occurred: ", error.message);
      toast.error(error.message || "An error occurred");
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
      desired_price: parseFloat("1.05"),
      product_url: "",
      website: "",
      user_id: parseInt(user_id),
      description: "",
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      // mutation.mutate(value);
    },
    validatorAdapter: zodValidator,
  });

  if (error) {
    return <h1>Error: {error.message}</h1>;
  }

  return (
    <>
      <div className="grid grid-cols-2">
        <h1 className="text-4xl font-medium text-start ">Tracked Products</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default" size={"lg"} className={cn("gap-1")}>
              <span>
                <FaPlus />
              </span>
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new product to track.
              </DialogDescription>
              <form
                className="space-y-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
              >
                <div className="grid gap-2">
                  <form.Field
                    name="name"
                    validators={{
                      onChange: z.string().min(1, "*Name is required"),
                      onChangeAsync: z.string().refine(
                        async (value) => {
                          await new Promise((resolve) =>
                            setTimeout(resolve, 1000)
                          );
                          return !value.includes("error");
                        },
                        {
                          message: "No 'error' allowed in name",
                        }
                      ),
                    }}
                    children={(field) => {
                      return (
                        <>
                          <Label htmlFor={field.name}>Name</Label>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            type="text"
                            placeholder="Enter the name of the product to track"
                          />
                          {field.state.meta.errors &&
                          field.state.meta.errors.length > 0 ? (
                            <span className="flex text-xs text-red-600">
                              {field.state.meta.errors.map((error, index) => (
                                <em key={index} role="alert">
                                  <span key={index}>{error}</span>
                                </em>
                              ))}
                            </span>
                          ) : null}
                        </>
                      );
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <form.Field
                    name="desired_price"
                    validators={{
                      onChange: z
                        .number({
                          required_error: "*Desired Price is required",
                          invalid_type_error: "*Desired Price must be a number",
                        })
                        .multipleOf(0.01),
                      onChangeAsync: z.number().refine(
                        async (value) => {
                          await new Promise((resolve) =>
                            setTimeout(resolve, 1000)
                          );
                          return !value.toString().includes("error");
                        },
                        {
                          message: "No 'error' allowed in desired_price",
                        }
                      ),
                    }}
                    children={(field) => {
                      return (
                        <>
                          <Label htmlFor={field.name}>Desired Price</Label>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => {
                              const stringEvent = e.target.value as string;
                              if (stringEvent === "" || stringEvent === " ") {
                                field.handleChange(0);
                              } else {
                                const desired_price = parseFloat(
                                  e.target.value
                                );

                                field.handleChange(desired_price);
                              }
                            }}
                            type="number"
                            step={0.1}
                            placeholder="Enter the desired price of the product."
                          />
                          {field.state.meta.errors &&
                          field.state.meta.errors.length > 0 ? (
                            <span className="flex text-xs text-red-600">
                              {field.state.meta.errors.map((error, index) => (
                                <em key={index} role="alert">
                                  <span key={index}>{error}</span>
                                </em>
                              ))}
                            </span>
                          ) : null}
                        </>
                      );
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <form.Field
                    name="product_url"
                    validators={{
                      onChange: z
                        .string({
                          required_error: "*Product URL is required",
                          invalid_type_error: "*Product URL must be a number",
                        })
                        .url({ message: "*Product URL must be a valid URL" }),
                      onChangeAsync: z.string().refine(
                        async (value) => {
                          await new Promise((resolve) =>
                            setTimeout(resolve, 1000)
                          );
                          return !value.toString().includes("error");
                        },
                        {
                          message: "No 'error' allowed in product_url",
                        }
                      ),
                    }}
                    children={(field) => {
                      return (
                        <>
                          <Label htmlFor={field.name}>Product URL</Label>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => {
                              field.handleChange(e.target.value);
                            }}
                            type="text"
                            placeholder="Enter the name of the product to track"
                          />
                          {field.state.meta.errors &&
                          field.state.meta.errors.length > 0 ? (
                            <span className="flex text-xs text-red-600">
                              {field.state.meta.errors.map((error, index) => (
                                <em key={index} role="alert">
                                  <span key={index}>{error}</span>
                                </em>
                              ))}
                            </span>
                          ) : null}
                        </>
                      );
                    }}
                  />
                </div>
                <form.Field
                  name="user_id"
                  children={(field) => {
                    return (
                      <>
                        <input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          type="text"
                          hidden={true}
                          placeholder="Enter the desired price of the product."
                        />
                        {field.state.meta.errors &&
                        field.state.meta.errors.length > 0 ? (
                          <span className="flex text-xs text-red-600">
                            {field.state.meta.errors.map((error, index) => (
                              <em key={index} role="alert">
                                <span key={index}>{error}</span>
                              </em>
                            ))}
                          </span>
                        ) : null}
                      </>
                    );
                  }}
                />
                <div className="grid gap-2">
                  <form.Field
                    name="website"
                    validators={{
                      onChange: z.string(),
                    }}
                    children={(field) => {
                      return (
                        <>
                          <Label htmlFor={field.name}>Website</Label>
                          <Select
                            onValueChange={(value) => {
                              field.handleChange(value);
                            }}
                          >
                            <SelectTrigger id={field.name}>
                              <SelectValue placeholder="Select Website" />
                            </SelectTrigger>
                            <SelectContent
                              onChange={() => {
                                return;
                              }}
                              position="popper"
                            >
                              <SelectItem value={"AMAZON" as const}>
                                Amazon
                              </SelectItem>
                              <SelectItem value={"NEWEGG" as const}>
                                NewEgg
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          {field.state.meta.errors &&
                          field.state.meta.errors.length > 0 ? (
                            <span className="flex text-xs text-red-600">
                              {field.state.meta.errors.map((error, index) => (
                                <em key={index} role="alert">
                                  <span key={index}>{error}</span>
                                </em>
                              ))}
                            </span>
                          ) : null}
                        </>
                      );
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <form.Field
                    name="description"
                    validators={{
                      onChange: z.string().min(1, "*Name is required"),
                      onChangeAsync: z.string().refine(
                        async (value) => {
                          await new Promise((resolve) =>
                            setTimeout(resolve, 1000)
                          );
                          return !value.includes("error");
                        },
                        {
                          message: "No 'error' allowed in name",
                        }
                      ),
                    }}
                    children={(field) => {
                      return (
                        <>
                          <Label htmlFor={field.name}>Description</Label>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            type="text"
                            placeholder="Enter the name of the product to track"
                          />
                          {field.state.meta.errors &&
                          field.state.meta.errors.length > 0 ? (
                            <span className="flex text-xs text-red-600">
                              {field.state.meta.errors.map((error, index) => (
                                <em key={index} role="alert">
                                  <span key={index}>{error}</span>
                                </em>
                              ))}
                            </span>
                          ) : null}
                        </>
                      );
                    }}
                  />
                </div>
                {/* <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Name of your project" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Framework</Label>
              <Select>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="next">Next.js</SelectItem>
                  <SelectItem value="sveltekit">SvelteKit</SelectItem>
                  <SelectItem value="astro">Astro</SelectItem>
                  <SelectItem value="nuxt">Nuxt.js</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div> */}
                <div className="flex gap-2 place-content-end">
                  <Button variant={"secondary"} type="button">
                    Cancel
                  </Button>
                  <Button variant={"default"} type="button">
                    Add
                  </Button>
                </div>
              </form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      {isPending && <h1>Loading...</h1>}
      {isError && <h1>Error: {error}</h1>}
      {data && data.length === 0 && <h1>No products found</h1>}

      {data && data.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <h2>Product</h2>

          {/* {data.map((product: any, idx: number) => (
            <div key={idx} className="bg-white shadow-lg rounded-lg p-4">
              <h1 className="text-lg font-semibold">{product.name}</h1>
              <p className="text-sm text-muted-foreground">{product.description}</p>
              <p className="text-sm text-muted-foreground">Price: {product.price}</p>
            </div>
          ))} */}
        </div>
      )}
    </>
  );
}

// function AddProductModal() {
//   const user_id = JSON.parse(localStorage.getItem("auth") || "").userId;
//   const mutation = useMutation({
//     mutationFn: addProductApi,
//     onSuccess: (res) => {
//       console.log(res);
//       toast.success("Logged in successfully");
//     },
//     onError: (error) => {
//       console.error("An error occurred: ", error.message);
//       toast.error(error.message || "An error occurred");
//     },
//   });

//   const form = useForm({
//     defaultValues: {
//       name: "",
//       desired_price: parseInt("0.00"),
//       product_url: "",
//       website: ("AMAZON" as const) || ("NEWEGG" as const),
//       user_id: parseInt(user_id),
//       description: "",
//     },
//     onSubmit: async ({ value }) => {
//       mutation.mutate(value);
//     },
//     validatorAdapter: zodValidator,
//   });

//   return (
//     <>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Add Product</DialogTitle>
//           <DialogDescription>
//             Fill in the details below to add a new product to track.
//           </DialogDescription>
//           <form
//             className="space-y-2"
//             onSubmit={(e) => {
//               e.preventDefault();
//               e.stopPropagation();
//               form.handleSubmit();

//             }}
//           >
//             <div className="grid gap-2">
//               <form.Field
//                 name="name"
//                 validators={{
//                   onChange: z.string().min(1, "*Name is required"),
//                   onChangeAsync: z.string().refine(
//                     async (value) => {
//                       await new Promise((resolve) => setTimeout(resolve, 1000));
//                       return !value.includes("error");
//                     },
//                     {
//                       message: "No 'error' allowed in name",
//                     }
//                   ),
//                 }}
//                 children={(field) => {
//                   return (
//                     <>
//                       <Label htmlFor={field.name}>Name</Label>
//                       <Input
//                         id={field.name}
//                         name={field.name}
//                         value={field.state.value}
//                         onBlur={field.handleBlur}
//                         onChange={(e) => field.handleChange(e.target.value)}
//                         type="text"
//                         placeholder="Enter the name of the product to track"
//                       />
//                       {field.state.meta.errors &&
//                       field.state.meta.errors.length > 0 ? (
//                         <span className="flex text-xs text-red-600">
//                           {field.state.meta.errors.map((error, index) => (
//                             <em key={index} role="alert">
//                               <span key={index}>{error}</span>
//                             </em>
//                           ))}
//                         </span>
//                       ) : null}
//                     </>
//                   );
//                 }}
//               />
//             </div>

//             {/* <div className="grid gap-2">
//               <form.Field
//                 name="desired_price"
//                 validators={{
//                   onChange: z
//                     .number({
//                       required_error: "*Desired Price is required",
//                       invalid_type_error: "*Desired Price must be a number",
//                     })
//                     .multipleOf(0.01),
//                   onChangeAsync: z.number().refine(
//                     async (value) => {
//                       await new Promise((resolve) => setTimeout(resolve, 1000));
//                       return !value.toString().includes("error");
//                     },
//                     {
//                       message: "No 'error' allowed in desired_price",
//                     }
//                   ),
//                 }}
//                 children={(field) => {
//                   return (
//                     <>
//                       <Label htmlFor={field.name}>Desired Price</Label>
//                       <Input
//                         id={field.name}
//                         name={field.name}
//                         value={field.state.value}
//                         onBlur={field.handleBlur}
//                         onChange={(e) => {
//                           const desired_price = parseFloat(e.target.value);
//                           field.handleChange(desired_price);
//                         }}
//                         type="number"
//                         placeholder="Enter the name of the product to track"
//                       />
//                       {field.state.meta.errors &&
//                       field.state.meta.errors.length > 0 ? (
//                         <span className="flex text-xs text-red-600">
//                           {field.state.meta.errors.map((error, index) => (
//                             <em key={index} role="alert">
//                               <span key={index}>{error}</span>
//                             </em>
//                           ))}
//                         </span>
//                       ) : null}
//                     </>
//                   );
//                 }}
//               />
//             </div> */}

//             {/* <div className="grid w-full items-center gap-4">
//             <div className="flex flex-col space-y-1.5">
//               <Label htmlFor="name">Name</Label>
//               <Input id="name" placeholder="Name of your project" />
//             </div>
//             <div className="flex flex-col space-y-1.5">
//               <Label htmlFor="framework">Framework</Label>
//               <Select>
//                 <SelectTrigger id="framework">
//                   <SelectValue placeholder="Select" />
//                 </SelectTrigger>
//                 <SelectContent position="popper">
//                   <SelectItem value="next">Next.js</SelectItem>
//                   <SelectItem value="sveltekit">SvelteKit</SelectItem>
//                   <SelectItem value="astro">Astro</SelectItem>
//                   <SelectItem value="nuxt">Nuxt.js</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div> */}
//           </form>
//         </DialogHeader>
//       </DialogContent>
//     </>
//   );
// }
