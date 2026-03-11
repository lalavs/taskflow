import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export const Hero = () => {
  return (
    <section className="py-10 md:py-24">
      <Container className="max-w-3xl">
        <h1 className="text-4xl font-bold leading-tight md:text-5xl">Manage projects visually with TaskFlow</h1>

        <p className="mt-6 text-base text-gray-600 md:text-lg">
          A simple and powerful project management tool with Kanban boards and real-time collaboration
        </p>

        <div className="mt-8 flex w-full flex-col gap-4 sm:flex-row sm:items-center">
          <Button>Get Started</Button>
          <Button variant="secondary">Learn More</Button>
        </div>
      </Container>
    </section>
  );
};
