"use client"

import {
  Users,
  Building2,
  Package,
  MapPin,
  Ship,
  Truck,
  BarChart3,
  Settings,
  Home,
  CreditCard,
  Warehouse,
  Navigation,
  FileText,
  LogOutIcon,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { Button } from "./ui/button"
import axios from "axios"
import { useRouter } from "next/navigation"

const menuItems = [
  {
    title: "Dashboard",
    url: "/Dashboard",
    icon: Home,
  },
  {
    title: "User Management",
    url: "/users",
    icon: Users,
  },
  {
    title: "Customer Management",
    url: "/customers",
    icon: Building2,
  },
  {
    title: "Products",
    url: "/products",
    icon: Package,
  },
  {
    title: "Free Zones",
    url: "/free-zones",
    icon: Warehouse,
  },
  {
    title: "Ports",
    url: "/ports",
    icon: MapPin,
  },
  {
    title: "Vessels",
    url: "/vessels",
    icon: Ship,
  },
  {
    title: "Transportation",
    url: "/transportation",
    icon: Truck,
  },
  {
    title: "Proforma Invoices",
    url: "/proforma-invoices",
    icon: FileText,
  },
  {
    title: "Payments",
    url: "/payments",
    icon: CreditCard,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
  },
]

function getCookie(name: string) {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
}

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Accept": "application/json",
    "X-Requested-With": "XMLHttpRequest"
  },
  withCredentials: true
})

api.interceptors.request.use(
  (config) => {
    const token = getCookie('XSRF-TOKEN');
    if (token && ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

async function getCsrfCookie() {
  await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
    withCredentials: true
  });
}

export function AppSidebar() {

  const router = useRouter()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/Dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Navigation className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Burhan Haiders</span>
                  <span className="truncate text-xs">Management System</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuButton asChild>
              <Button onClick={async() => {
                await getCsrfCookie()
                await api.post("/logout"),
                localStorage.removeItem("user")
                router.push("/Login")
              }}>
                <LogOutIcon />
                <span>Logout</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
