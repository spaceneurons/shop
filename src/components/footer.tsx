import Link from "next/link";
import { footerLinks } from "@/lib/data";

export function Footer() {
  return (
    <footer className="mt-10 border-t border-transparent">
      <div className="mx-auto flex w-full max-w-[1024px] flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-[35px] sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <Link href="/" className="logo text-[15px] text-[#1a1a1e]">
            LUMI
          </Link>
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="О магазине">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link text-[13px] text-[#6a6a70] hover:text-[#1a1a1e]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 text-[#1a1a1e]">
          <Social href="/contacts" label="Instagram">
            <InstagramIcon />
          </Social>
          <Social href="/contacts" label="Telegram">
            <TelegramIcon />
          </Social>
          <Social href="/contacts" label="ВКонтакте">
            <VkIcon />
          </Social>
          <Social href="/contacts" label="YouTube">
            <YouTubeIcon />
          </Social>
        </div>
      </div>
    </footer>
  );
}

function Social({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} aria-label={label} className="transition-transform hover:-translate-y-0.5">
      {children}
    </Link>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 5 3.8 11.2c-.9.35-.88 1.62.04 1.94l4.1 1.42 1.58 4.84c.32.98 1.64 1.12 2.16.22l2.26-3.9 4.46 3.28c.78.58 1.9.14 2.1-.82L21.7 6.2c.18-.9-.7-1.66-1.7-1.2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function VkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 8.2h2.3c.1 3.3 1.6 5.2 2.8 5.8V8.2h2.2v3.3c1.15-.12 2.36-1.46 2.77-3.3H16.2c-.3 1.4-1.2 2.7-1.9 3.4.7.5 1.8 1.6 2.2 3.5h-2.4c-.32-1.2-1.15-2.1-2.2-2.4v2.4H9.1V14c-1.7-.4-3.9-2.5-5.1-5.8Z" fill="currentColor" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="6.5" width="18" height="11" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M11 9.5v5l4.2-2.5L11 9.5Z" fill="currentColor" />
    </svg>
  );
}
