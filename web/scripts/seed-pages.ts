import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const dbUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaLibSql({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

async function seed() {
  const home = await prisma.customPage.upsert({
    where: { slug: "home" },
    update: { status: "published" },
    create: {
      id: crypto.randomUUID(),
      title: "Home",
      slug: "home",
      path: "/",
      status: "published",
      layout: "default",
      seo: JSON.stringify({ title: "NEOT — Adaptive Learning Platform" }),
    },
  });
  console.log("Homepage:", home.id);

  await prisma.pageSection.upsert({
    where: { id: "seed-home-hero" },
    update: { content: JSON.stringify({ title: "Learn Anything, Anywhere", subtitle: "Interactive courses for every age. Adaptive. Engaging. Free.", ctaText: "Get Started", background: "gradient" }) },
    create: { id: "seed-home-hero", pageId: home.id, blockType: "hero", sortOrder: 0, content: JSON.stringify({ title: "Learn Anything, Anywhere", subtitle: "Interactive courses for every age. Adaptive. Engaging. Free.", ctaText: "Get Started", background: "gradient" }), settings: "{}" },
  });
  console.log("  hero section added");

  await prisma.pageSection.upsert({
    where: { id: "seed-home-features" },
    update: { content: JSON.stringify({ columns: 3, cards: [{ icon: "BookOpen", title: "Interactive Lessons", description: "Learn by doing with quizzes and hands-on exercises." }, { icon: "BarChart3", title: "Track Progress", description: "Monitor your learning journey with detailed analytics." }, { icon: "School", title: "Expert Teachers", description: "Courses created by experienced educators." }] }) },
    create: { id: "seed-home-features", pageId: home.id, blockType: "feature-grid", sortOrder: 1, content: JSON.stringify({ columns: 3, cards: [{ icon: "BookOpen", title: "Interactive Lessons", description: "Learn by doing with quizzes and hands-on exercises." }, { icon: "BarChart3", title: "Track Progress", description: "Monitor your learning journey with detailed analytics." }, { icon: "School", title: "Expert Teachers", description: "Courses created by experienced educators." }] }), settings: "{}" },
  });
  console.log("  features section added");

  await prisma.pageSection.upsert({
    where: { id: "seed-home-stats" },
    update: { content: JSON.stringify({ items: [{ number: "10,000+", label: "Active Students" }, { number: "500+", label: "Courses" }, { number: "50+", label: "Expert Teachers" }, { number: "95%", label: "Satisfaction Rate" }] }) },
    create: { id: "seed-home-stats", pageId: home.id, blockType: "stats-bar", sortOrder: 2, content: JSON.stringify({ items: [{ number: "10,000+", label: "Active Students" }, { number: "500+", label: "Courses" }, { number: "50+", label: "Expert Teachers" }, { number: "95%", label: "Satisfaction Rate" }] }), settings: "{}" },
  });
  console.log("  stats section added");

  await prisma.pageSection.upsert({
    where: { id: "seed-home-cta" },
    update: { content: JSON.stringify({ text: "Ready to start your learning journey?", buttonText: "Get Started Free", buttonLink: "/signup", background: "primary" }) },
    create: { id: "seed-home-cta", pageId: home.id, blockType: "cta-banner", sortOrder: 3, content: JSON.stringify({ text: "Ready to start your learning journey?", buttonText: "Get Started Free", buttonLink: "/signup", background: "primary" }), settings: "{}" },
  });
  console.log("  CTA section added");

  const about = await prisma.customPage.upsert({
    where: { slug: "about" },
    update: { status: "published" },
    create: { id: crypto.randomUUID(), title: "About", slug: "about", path: "/about", status: "published", layout: "default", seo: JSON.stringify({ title: "About NEOT" }) },
  });
  console.log("About page:", about.id);

  await prisma.pageSection.upsert({
    where: { id: "seed-about-hero" },
    update: { content: JSON.stringify({ title: "About NEOT", subtitle: "Learning should adapt to humans. Not the other way around.", ctaText: "Explore Courses", ctaLink: "/courses", background: "color" }) },
    create: { id: "seed-about-hero", pageId: about.id, blockType: "hero", sortOrder: 0, content: JSON.stringify({ title: "About NEOT", subtitle: "Learning should adapt to humans. Not the other way around.", ctaText: "Explore Courses", ctaLink: "/courses", background: "color" }), settings: "{}" },
  });
  console.log("  hero section added");

  console.log("\nSeed complete! Visit / and /about");
}

seed().catch(console.error);
