import sinon from 'sinon'
import { Request, Response } from 'express'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { faker } from '@faker-js/faker'
import { ChatsService } from '@/routes/chats/chats.service'
import { ChatsController } from '@/routes/chats/chats.controller'
import { RowDataPacket } from 'mysql2'
import { HTTPStatusCodes } from '@/utils/constants'
import { NotFoundError, UnauthorizedError } from '@/utils/errors'

use(chaiAsPromised) // Use chai-as-promised

describe('ChatsController unit tests', () => {
  let chatsServiceStub: sinon.SinonStubbedInstance<ChatsService>
  let chatsController: ChatsController
  let req: Request
  let res: Partial<Response> & { sendSuccessResponse: sinon.SinonSpy }

  beforeEach(() => {
    chatsServiceStub = sinon.createStubInstance(ChatsService)
    chatsController = new ChatsController(chatsServiceStub)

    req = {
      userId: undefined,
      params: {},
      query: {},
      body: {},
    } as Request

    res = {
      sendSuccessResponse: sinon.spy(),
    }
  })

  describe('getChats', () => {
    it('Should return list of chats if userId is present in req', async () => {
      req.userId = faker.string.uuid()
      req.query = {
        page: '1',
        size: '10',
      }

      const mockedChats = [
        { id: faker.string.uuid() },
        { id: faker.string.uuid() },
      ] as RowDataPacket[]

      chatsServiceStub.getChats.resolves(mockedChats)

      await chatsController.getChats(req, res as Response)

      expect(chatsServiceStub.getChats.calledWith(req.query, req.userId)).to.be
        .true

      expect(
        res.sendSuccessResponse.calledWith(
          HTTPStatusCodes.Ok,
          undefined,
          mockedChats
        )
      ).to.be.true
    })

    it('Should throw UnauthorizedError if userId is NOT present in req', async () => {
      await expect(
        chatsController.getChats(req, res as Response)
      ).to.be.rejectedWith(UnauthorizedError)
    })
  })

  describe('getChat', () => {
    it('Should return chat if userId is provided in req and chatsService.getChatById returns existing chat', async () => {
      req.userId = faker.string.uuid()
      req.params.id = faker.string.uuid()

      const mockedChat = { id: faker.string.uuid() } as RowDataPacket

      chatsServiceStub.getChatById.resolves(mockedChat)

      await chatsController.getChat(req, res as Response)

      expect(chatsServiceStub.getChatById.calledWith(req.params.id, req.userId))
        .to.be.true

      expect(
        res.sendSuccessResponse.calledWith(
          HTTPStatusCodes.Ok,
          undefined,
          mockedChat
        )
      ).to.be.true
    })

    it('Should throw UnauthorizedError if userId is NOT present in req', async () => {
      await expect(
        chatsController.getChat(req, res as Response)
      ).to.be.rejectedWith(UnauthorizedError)
    })

    it('Should throw NotFoundError if chatsService.getChatById does not return existing chat', async () => {
      req.userId = faker.string.uuid()
      req.params.id = faker.string.uuid()

      chatsServiceStub.getChatById.resolves(undefined)

      await expect(
        chatsController.getChat(req, res as Response)
      ).to.be.rejectedWith(NotFoundError)
    })
  })

  describe('createChat', () => {
    it('Should return created chat with provided body', async () => {
      req.userId = faker.string.uuid()
      req.body = {
        title: faker.word.noun(),
      }
      const mockedChat = { id: faker.string.uuid() } as RowDataPacket

      chatsServiceStub.createChat.resolves(mockedChat)

      await chatsController.createChat(req, res as Response)

      expect(
        chatsServiceStub.createChat.calledWith({
          ...req.body,
          creatorId: req.userId,
        })
      ).to.be.true

      expect(
        res.sendSuccessResponse.calledWith(
          HTTPStatusCodes.Created,
          undefined,
          mockedChat
        )
      ).to.be.true
    })

    it('Should throw UnauthorizedError if userId is NOT present in req', async () => {
      await expect(
        chatsController.createChat(req, res as Response)
      ).to.be.rejectedWith(UnauthorizedError)
    })
  })

  describe('updateChat', () => {
    it('Should execute chatService.updateChat and return chat', async () => {
      req.userId = faker.string.uuid()
      req.params.id = String(faker.number.int())
      req.body = {
        title: faker.word.noun(),
      }

      const mockedChat = { id: faker.string.uuid() } as RowDataPacket

      chatsServiceStub.updateChat.resolves(mockedChat)

      await chatsController.updateChat(req, res as Response)

      expect(
        chatsServiceStub.updateChat.calledWith(
          req.params.id,
          req.userId,
          req.body
        )
      ).to.be.true

      expect(
        res.sendSuccessResponse.calledWith(
          HTTPStatusCodes.Ok,
          undefined,
          mockedChat
        )
      ).to.be.true
    })

    it('Should throw UnauthorizedError if userId is NOT present in req', async () => {
      await expect(
        chatsController.updateChat(req, res as Response)
      ).to.be.rejectedWith(UnauthorizedError)
    })
  })

  describe('deleteChat', () => {
    it('Should execute chatService.deleteChat and return success response', async () => {
      req.userId = faker.string.uuid()
      req.params.id = String(faker.number.int())

      chatsServiceStub.deleteChat.resolves()

      await chatsController.deleteChat(req, res as Response)

      expect(chatsServiceStub.deleteChat.calledWith(req.params.id, req.userId))
        .to.be.true

      expect(
        res.sendSuccessResponse.calledWith(HTTPStatusCodes.Ok, undefined, {
          id: req.params.id,
        })
      ).to.be.true
    })

    it('Should throw UnauthorizedError if userId is NOT present in req', async () => {
      await expect(
        chatsController.deleteChat(req, res as Response)
      ).to.be.rejectedWith(UnauthorizedError)
    })
  })

  describe('inviteUserToChat', () => {
    it('Should execute chatsService.addUserToChat and return success response', async () => {
      req.userId = faker.string.uuid()
      req.params.chatId = String(faker.number.int())
      req.params.userId = faker.string.uuid()

      chatsServiceStub.addUserToChat.resolves()

      await chatsController.inviteUserToChat(req, res as Response)

      expect(
        chatsServiceStub.addUserToChat.calledWith(
          req.params.chatId,
          req.params.userId,
          req.userId
        )
      ).to.be.true

      expect(
        res.sendSuccessResponse.calledWith(
          HTTPStatusCodes.Ok,
          'User successfully added to chat',
          {
            chatId: req.params.chatId,
          }
        )
      ).to.be.true
    })
  })
})
