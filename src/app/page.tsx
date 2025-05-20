
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home as HomeIcon, ListChecks, Clock, MapPinned, ScrollText, ArrowRight, Calculator, Gavel } from 'lucide-react'; // Added Calculator, Gavel
import Image from 'next/image';

const features = [
  {
    title: "Document Checklist",
    description: "Organize and track all necessary documents for estate administration.",
    href: "/checklist",
    icon: ListChecks,
    img: "https://placehold.co/600x400.png",
    imgHint: "documents checklist",
  },
  {
    title: "Timeline Estimator",
    description: "Get an AI-powered estimate for each step of the process based on your details.",
    href: "/timeline-estimator",
    icon: Clock,
    img: "https://placehold.co/600x400.png",
    imgHint: "calendar planning",
  },
  {
    title: "Fees Calculator",
    description: "Estimate potential administration fees based on estate details.",
    href: "/fees-calculator",
    icon: Calculator,
    img: "https://placehold.co/600x400.png",
    imgHint: "money calculator",
  },
  {
    title: "Personalized Roadmap",
    description: "Step-by-step guidance tailored to the small estate process.",
    href: "/roadmap",
    icon: MapPinned,
    img: "https://placehold.co/600x400.png",
    imgHint: "map journey",
  },
  {
    title: "Legal Guides",
    description: "Understand the key legal processes and requirements in Malaysian small estate law.",
    href: "/guides",
    icon: ScrollText,
    img: "https://placehold.co/600x400.png",
    imgHint: "law books",
  },
  {
    title: "Find a Lawyer",
    description: "Search for legal professionals specializing in estate law near you.",
    href: "/find-lawyer",
    icon: Gavel,
    img: "https://placehold.co/600x400.png",
    imgHint: "lawyer office",
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
          <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
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
          <div className="md:w-1/3">
            <Image 
              src="https://placehold.co/600x400.png" 
              alt="PusakaPro Illustration" 
              width={600} 
              height={400} 
              className="rounded-lg shadow-lg"
              data-ai-hint="legal family consultation" 
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-center mb-8 text-foreground">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48 w-full">
                <Image 
                  src={feature.img} 
                  alt={feature.title} 
                  layout="fill" 
                  objectFit="cover" 
                  data-ai-hint={feature.imgHint}
                />
              </div>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <feature.icon className="h-7 w-7 text-primary" />
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
