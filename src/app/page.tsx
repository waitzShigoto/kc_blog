import { redirect } from 'next/navigation';
import { siteConfig } from '@/lib/config';

export default function RootPage() {
  redirect(`/${siteConfig.defaultLocale}`);
} 