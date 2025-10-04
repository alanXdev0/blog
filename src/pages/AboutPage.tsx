import { motion } from "framer-motion";
import { Seo } from "@/components/seo/Seo";

export const AboutPage = () => (
  <div className="min-h-screen bg-white">
    <Seo title="About Alan Anaya" canonical="/about" />
    <section className="mx-auto max-w-4xl px-6 py-16">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-8 text-5xl font-bold md:text-6xl">About Me</h1>

        <div className="prose prose-lg max-w-none">
          <div className="mb-12 text-center md:text-left">
            <img
              src="/profile.jpg"
              alt="Alan Anaya"
              className="mx-auto mb-8 h-48 w-48 rounded-full border-4 border-blue-100 object-cover md:mx-0"
              loading="lazy"
            />
          </div>

          <p className="mb-6 text-xl leading-relaxed text-gray-700">
            Hi! I&apos;m <strong>Alan Anaya</strong>, a senior iOS developer, tech geek, and unapologetic coffee addict ☕.
            I&apos;m passionate about mobile development and about building apps that not only work but also feel great to use.
          </p>

          <h2 className="mt-12 text-3xl font-bold">What I Do</h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            I specialize in <strong>iOS and mobile app development</strong>, working with technologies like <strong>Swift, Flutter, and React Native</strong>.
            I&apos;m especially invested in the Apple ecosystem—MacBook, iPhone, iPad, and Apple Watch—and I enjoy exploring how everything connects to deliver seamless user experiences.
            At the same time, I keep an eye on the Android world, particularly Samsung and Pixel, to learn from both sides.
          </p>

          <h2 className="mt-12 text-3xl font-bold">Beyond Code</h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            This blog is my safe space: part technical notes, part personal reflections, and sometimes off-topic posts about music, football, or whatever idea I need to get out of my head.
          </p>

          <h2 className="mt-12 text-3xl font-bold">Let&apos;s Connect</h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            Want to see more of my work and projects?
            <br />
            <span role="img" aria-label="finger pointing right">
              👉
            </span>{" "}
            Check out my <strong>
              <a href="https://alananaya.dev" className="text-purple-600 hover:text-purple-700">
                Portfolio
              </a>
            </strong>
          </p>
        </div>
      </motion.div>
    </section>
  </div>
);

export default AboutPage;
