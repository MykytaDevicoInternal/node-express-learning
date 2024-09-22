import { z } from 'zod'

export const getChatsQuerySchema = z.object({
  title: z.string().optional(),
  page: z.string().optional(),
  size: z.string().optional(),
  field: z.literal('title').optional(),
  direction: z
    .union([z.literal('ASC').optional(), z.literal('DESC').optional()])
    .optional(),
})

export const getChatParamsSchema = z.object({
  id: z.string(),
})

export const createChatSchema = z.object({
  title: z.string().min(3),
})

export const deleteChatParamsSchema = z.object({
  id: z.string(),
})

export const updateChatBodySchema = z.object({
  title: z.string(),
})

export const updateChatParamsSchema = z.object({
  id: z.string(),
})

export const addUserToChatParamsSchema = z.object({
  chatId: z.string(),
  userId: z.string(),
})

export type ChatsRequestType = z.infer<typeof getChatsQuerySchema>
export type ChatRequestType = z.infer<typeof getChatParamsSchema>
export type CreateChatRequestType = z.infer<typeof createChatSchema>
export type DeleteChatRequestType = z.infer<typeof deleteChatParamsSchema>
export type UpdateChatRequestType = z.infer<typeof updateChatBodySchema>
