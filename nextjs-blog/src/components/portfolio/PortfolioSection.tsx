import ImageCarousel from './ImageCarousel';

interface App {
  id: string;
  title: string;
  description: string;
  images: string[];
  features: string[];
}

interface PortfolioSectionProps {
  title: string;
  apps: App[];
}

export default function PortfolioSection({ title, apps }: PortfolioSectionProps) {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-foreground mb-8 border-b-2 border-blue-500 pb-2">
        {title}
      </h2>
      
      <div className="space-y-12">
        {apps.map((app) => (
          <div key={app.id} id={app.id}>
            <ImageCarousel
              images={app.images}
              title={app.title}
              description={app.description}
              features={app.features}
            />
          </div>
        ))}
      </div>
    </section>
  );
} 