import { openrouter } from "@/ai/open-router";
import { tools } from "@/ai/tools";
import { convertToModelMessages, createUIMessageStream, createUIMessageStreamResponse, generateId, stepCountIs, streamText } from "ai";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { messages } = await request.json();

  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      const statusId = generateId();
      // Write general data (transient - not added to message history)
      writer.write({
        type: 'data-status',
        id: statusId,
        data: { status: 'call started' },
      });

      const result = streamText({
        model: openrouter.chat('openai/gpt-4o-2024-11-20'),
        tools: tools,
        messages: convertToModelMessages(messages),
        system: 'Sempre responda em markdown sem aspas no ínicio ou fim da mensagem.',
        stopWhen: stepCountIs(5),
        onChunk() {
          // Write data parts that update during streaming
          writer.write({
            type: 'data-status',
            id: statusId,
            data: {
              status: 'streaming',
              timestamp: Date.now(),
            },
          });
        },
        onFinish() {
          // Write final data parts
          writer.write({
            type: 'data-status',
            id: statusId,
            data: {
              status: 'completed',
            },
          });
        },
      });

      writer.merge(result.toUIMessageStream());
    },
  });
  return createUIMessageStreamResponse({ stream });
}
