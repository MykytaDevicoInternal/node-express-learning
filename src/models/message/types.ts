export type GetMessageArguments = {
  pagination: {
    page: number
    size: number
  }

  order: {
    field: 'createdAt'
    direction: 'ASC' | 'DESC'
  }

  where: {
    text?: string
    chatId: string
  }
}

export type CreateMessageArguments = {
  text: string
  chatId: string
  forwardedChatId?: string
  forwardedFromUserId?: string
  repliedMessageId?: string
}

export type UpdateMessageArguments = {
  id: string
  data: {
    text: string
  }
}
