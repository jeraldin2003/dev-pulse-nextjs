import { useRouter } from 'next/navigation';

export default function AppLayout() {
  const router = useRouter();
  router.replace('/app/dashboard');
}