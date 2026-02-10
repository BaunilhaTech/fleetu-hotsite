import { NotFoundPage } from "@/components/NotFoundPage";
import { defaultLocale } from "@/i18n";

export default function GlobalNotFound() {
  return <NotFoundPage homeHref={`/${defaultLocale}`} />;
}
