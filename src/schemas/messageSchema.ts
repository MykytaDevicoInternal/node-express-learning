import { z } from 'zod'

export const createMessageBodySchema = z.object({
  text: z.string(),
  forwardedChatId: z.string().optional(),
  forwardedFromUserId: z.string().optional(),
  repliedMessageId: z.string().optional(),
})

export const createMessageParamsSchema = z.object({
  chatId: z.string(),
})

export const getMessagesBodySchema = z.object({
  text: z.string().optional(),
  page: z.string().optional(),
  size: z.string().optional(),
  field: z.literal('createdAt').optional(),
  direction: z
    .union([z.literal('ASC').optional(), z.literal('DESC').optional()])
    .optional(),
})

export const getMessagesParamsSchema = z.object({
  chatId: z.string(),
})

export const deleteMessageSchema = z.object({
  id: z.string(),
  chatId: z.string(),
})

export const updateMessageBodySchema = z.object({
  text: z.string(),
})

export const updateMessageParamsSchema = z.object({
  id: z.string(),
  chatId: z.string(),
})

export type MessagesRequestType = z.infer<typeof getMessagesBodySchema>
export type CreateMessageRequestType = z.infer<typeof createMessageBodySchema>
export type DeleteMessageRequestType = z.infer<typeof deleteMessageSchema>
export type UpdateMessageRequestType = z.infer<typeof updateMessageBodySchema>
