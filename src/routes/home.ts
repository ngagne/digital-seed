import {
  FastifyPluginAsyncTypebox,
  Type
} from '@fastify/type-provider-typebox'

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    '/',
    {
      schema: {
        response: {
          200: Type.Object({
            message: Type.String()
          })
        }
      }
    },
    async function () {
      const currentDate = new Date()
      return { message: `Welcome to the demo website! The current date is ${currentDate.toLocaleDateString()}` }
    }
  )
}

export default plugin
