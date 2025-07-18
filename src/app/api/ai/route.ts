import { openrouter } from "@/ai/open-router";
import { generateText, streamText, tool } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export async function GET(request: NextRequest) {
  // const { messages } = await request.json()

  const result = await generateText({
    model: openrouter.chat('openai/gpt-4o-2024-11-20'),
    tools: {
      profileAndUrls: tool({
        description: 'Essa ferramenta serve para buscar do perfil de um usuário do GitHub ou acessar URLs da API para outras informações de um usuário como lista de organizações, repositórios, eventos, seguidores, seguindo, etc...',
        parameters: z.object({
          username: z.string().describe('Username do usuário no GitHub'),
        }),
        execute: async ({ username }) => {
          console.log(username)
          const response = await fetch(`https://api.github.com/users/${username}`)
          const data = await response.json()

          return JSON.stringify(data)
        },
      }),

      fetchHTTP: tool({
        description: "Essa ferramenta serve para realizar uma requisição HTTP em uma URL especificada e acessar sua resposta",
        parameters: z.object({
          url: z.string().describe('URL a ser requisitada'),
        }),
        execute: async ({ url }) => {
          const response = await fetch(url)
          const data = await response.text()

          return data
        },
      }),
    },
    prompt: 'Me dê uma lista de usuários que o Christian-Oliveira segue no GitHub.',
    // messages,
    // system: 'Sempre responda em marldown sem aspas no ínicio ou fim da mensagem.',
    maxSteps: 5,
  })

  return NextResponse.json({ message: result.text, parts: result.toolResults })
}