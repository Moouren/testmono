import { redirect } from 'next/navigation';

export default function Home() {
  // This will redirect at the server level - no client-side rendering needed
  redirect('/dashboard');
}