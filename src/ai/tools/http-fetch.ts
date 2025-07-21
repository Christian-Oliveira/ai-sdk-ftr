import { tool } from "ai";
import z from "zod";

export const httpFetch = tool({
  description: "Essa ferramenta serve para realizar uma requisição HTTP em uma URL especificada e acessar sua resposta",
  inputSchema: z.object({
    url: z.string().describe('URL a ser requisitada'),
  }),
  execute: async ({ url }) => {
    const response = await fetch(url)
    const data = await response.text()

    return data
  },
})