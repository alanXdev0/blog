import { Container } from '@/components/layout/Container';
import { Seo } from '@/components/seo/Seo';
import { SectionHeader } from '@/components/ui/SectionHeader';

const experienceHighlights = [
  {
    title: "Mobile architecture & delivery",
    description:
      "Lead end-to-end builds across SwiftUI, UIKit, and Kotlin Multiplatform; implement clean architectures, modular design systems, and automated release pipelines.",
  },
  {
    title: "Cross-platform craft",
    description:
      "Ship React Native and Flutter apps that feel genuinely native. Tune animations, accessibility, and performance for Apple's expectations.",
  },
  {
    title: "Tooling & automation",
    description:
      "Design CI/CD workflows with fastlane, Xcode Cloud, Bitrise, and GitHub Actions - covering testing, linting, screenshotting, and deploy orchestration.",
  },
];

const timeline = [
  {
    year: "2025",
    label: "VenueVent release",
    detail: "Shipped a location-intelligent venue discovery app with SwiftUI and CloudKit sync.",
  },
  {
    year: "2024",
    label: "Aztlan scaling",
    detail: "Led React Native modernization, redesigned booking flows, and built offline capabilities.",
  },
  {
    year: "2023",
    label: "Tooling overhaul",
    detail: "Standardized CI/CD templates for mobile teams, cutting release time by 40%.",
  },
  {
    year: "2019 ->",
    label: "Independent & consultancy",
    detail: "Partnering with startups and agencies to craft mobile experiences rooted in Apple-quality design.",
  },
];

export const AboutPage = () => (
  <div className="space-y-20 pb-24">
    <Seo
      title="About Alan Anaya"
      description="Senior mobile engineer crafting Apple-quality experiences across native and cross-platform stacks."
      canonical="/about"
    />
    <section className="border-b border-neutral-200/80 bg-gradient-to-b from-white to-neutral-100/50 py-24">
      <Container className="grid gap-16 md:grid-cols-[3fr_2fr] md:items-center">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">About</p>
          <h1 className="text-4xl font-semibold text-neutral-950 md:text-5xl">
            Hi, I'm Alan - senior mobile engineer crafting Apple-quality experiences.
          </h1>
          <p className="max-w-2xl text-base text-neutral-600">
            I build across iOS, Android, Flutter, and React Native, balancing a designer's attention to detail with an engineer's love for robust systems. My work spans hands-on product delivery, team enablement, and the tooling that keeps ambitious mobile teams shipping.
          </p>
        </div>
        <div className="space-y-4 rounded-3xl border border-neutral-200/80 bg-white p-8 shadow-subtle/40">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">Currently based in</h2>
          <p className="text-xl font-semibold text-neutral-900">Mexico City (CDMX)</p>
          <p className="text-sm text-neutral-600">
            Collaborating remotely with teams across North America and Europe, building products that feel intentional everywhere.
          </p>
        </div>
      </Container>
    </section>

    <section>
      <Container className="space-y-10">
        <SectionHeader
          eyebrow="Focus"
          title="Blending craft, systems, and continuous delivery"
          description="A snapshot of how I think about mobile product engineering."
        />
        <div className="grid gap-8 md:grid-cols-3">
          {experienceHighlights.map((highlight) => (
            <div
              key={highlight.title}
              className="rounded-3xl border border-neutral-200/80 bg-white p-8 shadow-subtle/40"
            >
              <h3 className="text-lg font-semibold text-neutral-900">{highlight.title}</h3>
              <p className="mt-3 text-sm text-neutral-600">{highlight.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>

    <section>
      <Container className="space-y-10">
        <SectionHeader
          eyebrow="Timeline"
          title="Moments that shaped my approach"
          description="Highlights from the past few years building and scaling mobile products."
        />
        <div className="relative space-y-8 before:absolute before:left-3 before:h-full before:w-px before:bg-neutral-200/80 before:content-[''] md:before:left-1/2">
          {timeline.map((event, index) => (
            <div key={event.year} className="relative md:flex md:items-center md:gap-12">
              <span
                className="absolute left-0 flex size-6 items-center justify-center rounded-full border border-accent bg-white text-xs font-semibold text-accent shadow-subtle/40 md:left-1/2 md:-translate-x-1/2"
              >
                {index + 1}
              </span>
              <div className="ml-10 rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-subtle/30 md:ml-0 md:w-1/2 md:translate-x-[-60%]">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">{event.year}</p>
                <h3 className="mt-3 text-lg font-semibold text-neutral-900">{event.label}</h3>
                <p className="mt-2 text-sm text-neutral-600">{event.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  </div>
);

export default AboutPage;
