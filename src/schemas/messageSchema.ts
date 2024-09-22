import { z } from 'zod'

export const createMessageSchema = z.object({
  text: z.string(),
  chatId: z.string(),
  forwardedChatId: z.string().optional(),
  forwardedFromUserId: z.string().optional(),
  repliedMessageId: z.string().optional(),
})

export const getMessagesSchema = z.object({
  text: z.string().optional(),
  chatId: z.string().optional(),
  page: z.string().optional(),
  size: z.string().optional(),
  field: z.literal('createdAt').optional(),
  direction: z
    .union([z.literal('ASC').optional(), z.literal('DESC').optional()])
    .optional(),
})

export const getMessageSchema = z.object({
  id: z.string(),
})

export const deleteMessageSchema = z.object({
  id: z.string(),
})

export const updateMessageBodySchema = z.object({
  text: z.string(),
})

export const updateMessageParamsSchema = z.object({
  id: z.string(),
})

export type MessagesRequestType = z.infer<typeof getMessagesSchema>
export type MessageRequestType = z.infer<typeof getMessageSchema>
export type CreateMessageRequestType = z.infer<typeof createMessageSchema>
export type DeleteMessageRequestType = z.infer<typeof deleteMessageSchema>
export type UpdateMessageRequestType = z.infer<typeof updateMessageBodySchema>
