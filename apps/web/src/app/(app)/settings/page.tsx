import { redirect } from "next/navigation";
import { PAGES } from "@/constants/page";

export default function SettingsPage() {
  redirect(PAGES.SETTINGS_SERVER);
}
