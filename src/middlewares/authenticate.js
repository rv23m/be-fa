async function authenticate(fastify, options) {
  fastify.decorate("authenticate", async (request, reply) => {
    try {
      //   const user = await fastify.prisma.user.findUnique({
      //     where: { email: "alex.dunphy@mailinator.com" },
      //     include: { tenant: true, role: true },
      //   });

      const cachedTenant = {
        id: "67b272f6ad9d6d15abe44d75",
        name: "Siri Lilja",
        slug: "siri-lilja",
        is_deleted: false,
        seats: 10,
        created_at: "2025-02-16T23:21:26.024Z",
        updated_at: "2025-02-16T23:21:26.024Z",
      };

      const cachedUser = {
        id: "67b272f7ad9d6d15abe44d76",
        tenant_id: "67b272f6ad9d6d15abe44d75",
        first_name: "Alex",
        last_name: "Dunphy",
        email: "alex.dunphy@mailinator.com",
        password: "hashedpassword",
        role_id: "67b272f4ad9d6d15abe44d71",
        is_deleted: false,
        is_frozen: false,
        created_at: "2025-02-16T23:21:27.146Z",
        updated_at: "2025-02-16T23:21:27.146Z",
        tenant: {
          id: "67b272f6ad9d6d15abe44d75",
          name: "Siri Lilja",
          slug: "siri-lilja",
          is_deleted: false,
          seats: 10,
          created_at: "2025-02-16T23:21:26.024Z",
          updated_at: "2025-02-16T23:21:26.024Z",
        },
        role: {
          id: "67b272f4ad9d6d15abe44d71",
          name: "ADMIN",
          is_deleted: false,
          created_at: "2025-02-16T23:21:22.653Z",
          updated_at: "2025-02-16T23:21:22.653Z",
        },
      };
      const cachedUser1 = {
        id: "68738a2f6f0519939e4eb96f",
        tenant_id: "67b272f6ad9d6d15abe44d75",
        first_name: "Julia",
        last_name: "Gerasim",
        email: "julia.gerasim@mailinator.com",
        password: "hashedpassword",
        role_id: "67b272f4ad9d6d15abe44d71",
        is_deleted: false,
        is_frozen: false,
        created_at: "2025-02-16T23:21:27.146Z",
        updated_at: "2025-02-16T23:21:27.146Z",
        tenant: {
          id: "67b272f6ad9d6d15abe44d75",
          name: "Siri Lilja",
          slug: "siri-lilja",
          is_deleted: false,
          seats: 10,
          created_at: "2025-02-16T23:21:26.024Z",
          updated_at: "2025-02-16T23:21:26.024Z",
        },
        role: {
          id: "67b272f4ad9d6d15abe44d71",
          name: "ADMIN",
          is_deleted: false,
          created_at: "2025-02-16T23:21:22.653Z",
          updated_at: "2025-02-16T23:21:22.653Z",
        },
      };

      request.user = cachedUser1;
      request.tenant = cachedTenant;

      //   reply.code(401).send({ error: user });
    } catch (err) {
      reply.code(401).send({ error: "Unauthorized" });
    }
  });
}

export default authenticate;
