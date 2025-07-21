import { tool } from "ai";
import z from "zod";

export const githubProfile = tool({
  description: 'Essa ferramenta serve para buscar do perfil de um usuário do GitHub ou acessar URLs da API para outras informações de um usuário como lista de organizações, repositórios, eventos, seguidores, seguindo, etc...',
  inputSchema: z.object({
    username: z.string().describe('Username do usuário no GitHub'),
  }),
  execute: async ({ username }) => {
    const response = await fetch(`https://api.github.com/users/${username}`)
    const data = await response.json()

    return JSON.stringify(data)
  },
})