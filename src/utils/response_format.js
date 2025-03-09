export const ResponseFormat = {
  200: ({ reply, data, message = "Success", statusCode = 200 }) => {
    reply.code(statusCode).send({
      success: true,
      message,
      data,
    });
  },
  400: ({ reply, data, message = "An error occurred", statusCode = 400 }) => {
    return reply.code(statusCode).send({
      success: false,
      message,
      data,
    });
  },
};

export default ResponseFormat;
