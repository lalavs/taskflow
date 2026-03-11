import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';

export const Header = () => {
  return (
    <header className="border-b">
      <Container className="flex h-16 items-center justify-between">
        <Logo />

        <nav className="flex gap-4">
          <Button variant="secondary">Login</Button>
          <Button>Get Started</Button>
        </nav>
      </Container>
    </header>
  );
};
