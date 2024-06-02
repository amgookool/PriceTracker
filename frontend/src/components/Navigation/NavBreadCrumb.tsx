import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { Link, useRouter } from "@tanstack/react-router";
import React from "react";

const NavBreadCrumb = () => {
  const router = useRouter();
  const path = router.parseLocation().pathname;
  const breadcrumbs = [
    {
      name: "Home",
      url: "/",
    },
  ];
  path.split("/").map((item: string, idx: number) => {
    if (item === "") return;
    breadcrumbs.push({
      name: item.charAt(0).toUpperCase() + item.slice(1),
      url:
        idx > 1
          ? breadcrumbs[breadcrumbs.length - 1].url + "/" + item
          : breadcrumbs[breadcrumbs.length - 1].url + item,
    });
  });

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((item, idx) => {
            return (
              <React.Fragment key={idx}>
                <BreadcrumbItem key={idx}>
                  {idx === breadcrumbs.length - 1 && (
                    <BreadcrumbPage className={cn(`font-bold font-serif `)}>{item.name}</BreadcrumbPage>
                  )}
                  {idx != breadcrumbs.length - 1 && (
                    <Link className={cn(`font-normal font-serif hover:underline`)} to={item.url}>{item.name}</Link>
                  )}
                </BreadcrumbItem>
                {idx !== breadcrumbs.length - 1 && (
                  <BreadcrumbSeparator>/</BreadcrumbSeparator>
                )}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
};

export default NavBreadCrumb;
