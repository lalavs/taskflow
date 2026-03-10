import { Container } from '@/components/ui/Container';

const featuresList = [
  {
    id: 1,
    title: 'Kanban Boards',
    description: 'Organize tasks visually and move them easily',
  },
  {
    id: 2,
    title: 'Real-time updates',
    description: 'Stay in sync with your team instantly',
  },
  {
    id: 3,
    title: 'Simple workflow',
    description: 'Focus on work without unnecessary complexity',
  },
];

export const Features = () => {
  return (
    <section className="py-10 bg-gray-50 md:py-20">
      <Container>
        <h2 className="text-2xl font-bold md:text-3xl">Features</h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {featuresList.map((feature) => (
            <div key={feature.id} className="rounded-lg border p-6">
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
