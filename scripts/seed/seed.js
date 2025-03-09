import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seed() {
  try {
    // Create Roles
    const roles = await prisma.role.createMany({
      data: [{ name: "ADMIN" }, { name: "AGENT" }],
    });

    // Create Call Types
    const callTypes = await prisma.call_type.createMany({
      data: [
        { name: "ranked", prompt_name: "Ranked Call" },
        { name: "practise", prompt_name: "Practise Call" },
      ],
    });

    // Create Tenant
    const tenant = await prisma.tenant.create({
      data: {
        name: "Siri Lilja",
        slug: "siri-lilja",
        seats: 10,
      },
    });

    // Create User
    const adminRole = await prisma.role.findFirst({ where: { name: "ADMIN" } });
    const user = await prisma.user.create({
      data: {
        first_name: "Alex",
        last_name: "Dunphy",
        email: "alex.dunphy@mailinator.com",
        password: "hashedpassword", // Replace with a properly hashed password
        tenant_id: tenant.id,
        role_id: adminRole.id,
      },
    });

    // Create Persona Jobs
    const jobs = await prisma.persona_job.createMany({
      data: [
        { title: "CEO", prompt_job: "CEO" },
        { title: "CMO", prompt_job: "CMO" },
        { title: "CFO", prompt_job: "CFO" },
      ],
    });

    // Create Persona Industries
    const industries = await prisma.persona_industry.createMany({
      data: [
        { industry: "Marketing", prompt_industry: "Marketing" },
        {
          industry: "Banking and Finance",
          prompt_industry: "Banking and Finance",
        },
        { industry: "Engineering", prompt_industry: "Engineering" },
      ],
    });

    // Create Persona Objections
    const objections = await prisma.persona_objection.createMany({
      data: [
        { objection: "Budget concerns", prompt_objection: "Budget concerns" },
        { objection: "New to role", prompt_objection: "New to role" },
        {
          objection: "Using Competitor Product",
          prompt_objection: "Using Competitor Product",
        },
      ],
    });

    // Create Persona Names
    const names = await prisma.persona_name.createMany({
      data: [
        { name: "Taylor Morgan", prompt_name: "Taylor Morgan" },
        { name: "Alex Harper", prompt_name: "Alex Harper" },
        { name: "Casey Quinn", prompt_name: "Casey Quinn" },
        { name: "Cameron Bailey", prompt_name: "Cameron Bailey" },
        { name: "Blake Ellis", prompt_name: "Blake Ellis" },
        { name: "Morgan Reese", prompt_name: "Morgan Reese" },
      ],
    });

    console.log("Seed data successfully added:", {
      tenant,
      user,
      roles: roles,
      jobTitles: jobs,
      industries: industries,
      objections: objections,
      personaNames: names,
    });

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
