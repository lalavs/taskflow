'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';

import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';

export const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="border-b">
      <Container className="flex h-16 items-center justify-between">
        <Logo />

        <nav className="flex gap-4 items-center">
          {session ? (
            <>
              <Image
                src={session.user?.image || '/icons/default-avatar.png'}
                alt="avatar"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />

              <span className="text-sm">{session.user?.name}</span>

              <Link href="/board">
                <Button>Get to board</Button>
              </Link>

              <Button variant="secondary" onClick={() => signOut()}>
                Logout
              </Button>
            </>
          ) : (
            <Button onClick={() => signIn('google')}>
              Login
            </Button>
          )}
        </nav>
      </Container>
    </header>
  );
};
