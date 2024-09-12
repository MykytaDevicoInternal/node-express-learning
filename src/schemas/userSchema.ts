import { z } from 'zod'

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const userSingUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(3),
  lastName: z.string().min(3),
})

export type LoginRequestType = z.infer<typeof userLoginSchema>
export type SingUpRequestType = z.infer<typeof userSingUpSchema>
