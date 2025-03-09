import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedPersonas() {
  try {
    const tenantSlug = "siri-lilja";
    let tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
    });

    if (!tenant) {
      console.error(`Tenant with slug "${tenantSlug}" not found. Exiting.`);
      process.exit(1);
    }

    // Fetch all required records before creating personas
    const jobRecords = await prisma.persona_job.findMany();
    const industryRecords = await prisma.persona_industry.findMany();
    const objectionRecords = await prisma.persona_objection.findMany();
    const nameRecords = await prisma.persona_name.findMany();

    if (
      jobRecords.length === 0 ||
      industryRecords.length === 0 ||
      objectionRecords.length === 0 ||
      nameRecords.length === 0
    ) {
      console.warn(
        "One or more required records are missing. Skipping persona seeding."
      );
      return;
    }

    const personas = [];

    for (let i = 0; i < 3; i++) {
      const persona = await prisma.persona.create({
        data: {
          tenant_id: tenant.id,
          job_id: jobRecords[Math.floor(Math.random() * jobRecords.length)].id,
          industry_id:
            industryRecords[Math.floor(Math.random() * industryRecords.length)]
              .id,
          objection_id:
            objectionRecords[
              Math.floor(Math.random() * objectionRecords.length)
            ].id,
          name_id:
            nameRecords[Math.floor(Math.random() * nameRecords.length)].id,
        },
      });
      personas.push(persona);
    }

    console.log("Personas seeded successfully:", personas);
  } catch (error) {
    console.error("Error seeding personas:", error);
  }
}

seedPersonas();
