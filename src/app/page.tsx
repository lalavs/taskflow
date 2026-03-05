import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';
import { Footer } from '@/components/layout/Footer';

const HomePage = () => {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <Footer />
    </>
  );
};

export default HomePage;
