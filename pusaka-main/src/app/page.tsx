
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home as HomeIcon, ListChecks, MapPinned, ArrowRight, Library } from 'lucide-react';
import Image from 'next/image';

const features = [
  {
    title: "Document Checklist",
    description: "Organize and track all necessary documents for estate administration.",
    href: "/checklist",
    icon: ListChecks,
    img: "https://images.unsplash.com/photo-1581093588401-0b3a0a1a7a3a?auto=format&fit=crop&w=600&q=80",
    imgHint: "document checklist",
  },
  {
    title: "Roadmap & Timeline",
    description: "Get AI-powered timeline estimates and follow a step-by-step process.",
    href: "/roadmap",
    icon: MapPinned,
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
    imgHint: "journey timeline",
  },
  {
    title: "Legal & Financial Hub",
    description: "Access legal guides, estimate fees, and find legal professionals.",
    href: "/legal-financial-hub",
    icon: Library,
    img: "https://images.unsplash.com/photo-1556741533-f6acd647d2fb?auto=format&fit=crop&w=600&q=80",
    imgHint: "legal finance",
  },
];

export default function HomePage() {
  return (
    <div className="container mx-auto">
      <PageHeader
        title="Welcome to PusakaPro"
        description="Your comprehensive assistant for navigating Malaysian small estate administration with clarity and confidence."
        icon={HomeIcon}
      />

      <section className="mb-12 p-6 bg-card rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-full mb-6 md:mb-0 md:pr-8">
            <h2 className="text-2xl font-semibold text-primary mb-3">Streamline Your Estate Process</h2>
            <p className="text-foreground mb-4">
              PusakaPro is designed to simplify the complexities of small estate administration in Malaysia. 
              We provide tools and information to help you understand the requirements, organize documents, 
              estimate timelines and fees, and follow a clear roadmap.
            </p>
            <p className="text-foreground">
              Whether you are an heir, an administrator, or simply seeking information, 
              PusakaPro aims to make this journey more manageable.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-center mb-8 text-foreground">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Adjusted grid for 3 items */}
          {features.map((feature) => (
            <Card key={feature.title} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <feature.icon className="h-12 w-12 text-primary" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end">
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link href={feature.href} className="flex items-center justify-center gap-2">
                    Explore <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
