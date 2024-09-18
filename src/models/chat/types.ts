export type GetChatsArguments = {
  pagination: {
    page: number
    size: number
  }

  order: {
    field: 'title'
    direction: 'ASC' | 'DESC'
  }

  where: {
    title?: string
  }

  userId: string
}

export type CreateChatArguments = {
  title: string
  creatorId: string
}

export type UpdateChatArguments = {
  id: string
  title?: string
}
