import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function MainSidebar() {
  return (
    <div className="flex flex-row whitespace-nowrap overflow-clip ease-in-out transition-[width] duration-500 will-change-[width] transform-gpu w-[300px]">
      <div className="flex flex-col w-full h-full p-4 overflow-y-auto no-scrollbar">
        <div className="flex items-center gap-4 -m-1 p-1 overflow-clip ">
          <Link
            className="size-12 box-border border border-sidebar-border shadow-sm rounded-lg p-1 shrink-0 active"
            href="/"
            data-status="active"
          >
            <Image alt="Home" src="/logo.png" width={100} height={100} />
          </Link>
          <div className="">RPanel - v0.0.1</div>
        </div>

        <div className="mt-12 flex flex-col gap-2">
          <Link
            className="group flex items-center gap-4 rounded-lg py-[10px] px-[15px] overflow-clip hover:bg-sidebar-accent transition-all bg-background-secondary hover:!bg-background border border-sidebar-border shadow-sm"
            href="/"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-house size-[18px] shrink-0"
            >
              <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
              <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            </svg>
            <span className="font-medium transition-opacity duration-150 group-data-[state=collapsed]/sidebar:opacity-0 flex-1 text-left">
              Panel
            </span>
          </Link>

          <Link
            href="/templates"
            className="group flex items-center gap-4 rounded-lg py-[10px] px-[15px] overflow-clip hover:bg-sidebar-accent transition-all"
          >
            <ShoppingBag
              width={24}
              height={24}
              className="lucide lucide-house size-[18px] shrink-0"
            />
            <span className="font-medium transition-opacity duration-150 group-data-[state=collapsed]/sidebar:opacity-0 flex-1 text-left">
              Templates
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
