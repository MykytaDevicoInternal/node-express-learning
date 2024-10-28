import sinon from 'sinon'
import { Request, Response } from 'express'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { faker } from '@faker-js/faker'
import { MessagesServices } from '@/routes/messages/messages.service'
import { MessageController } from '@/routes/messages/messages.controller'
import { RowDataPacket } from 'mysql2'
import { HTTPStatusCodes } from '@/utils/constants'
import { NotFoundError, UnauthorizedError } from '@/utils/errors'

use(chaiAsPromised) // Use chai-as-promised

describe('MessageController unit tests', () => {
  let messagesServiceStub: sinon.SinonStubbedInstance<MessagesServices>
  let messagesController: MessageController
  let req: Request
  let res: Partial<Response> & { sendSuccessResponse: sinon.SinonSpy }

  beforeEach(() => {
    messagesServiceStub = sinon.createStubInstance(MessagesServices)
    messagesController = new MessageController(messagesServiceStub)

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

  describe('getMessages', () => {
    it('Should return list of messages if userId is present in req', async () => {
      req.userId = faker.string.uuid()
      req.params.chatId = faker.string.uuid()
      req.query = {
        page: '1',
        size: '10',
      }

      const mockedMessages = [
        { id: faker.string.uuid() },
        { id: faker.string.uuid() },
      ] as RowDataPacket[]

      messagesServiceStub.getMessages.resolves(mockedMessages)

      await messagesController.getMessages(req, res as Response)

      expect(
        messagesServiceStub.getMessages.calledWith(
          req.query,
          req.userId,
          req.params.chatId
        )
      ).to.be.true

      expect(
        res.sendSuccessResponse.calledWith(
          HTTPStatusCodes.Ok,
          undefined,
          mockedMessages
        )
      ).to.be.true
    })

    it('Should throw UnauthorizedError if userId is NOT present in req', async () => {
      await expect(
        messagesController.getMessages(req, res as Response)
      ).to.be.rejectedWith(UnauthorizedError)
    })
  })

  describe('createMessage', () => {
    it('Should return created message with provided body', async () => {
      req.userId = faker.string.uuid()
      req.params.chatId = faker.string.uuid()
      req.body = {
        text: faker.lorem.sentence(),
      }

      const mockedMessage = {
        id: faker.string.uuid(),
        text: req.body.text,
      } as RowDataPacket

      messagesServiceStub.createMessage.resolves(mockedMessage)

      await messagesController.createMessage(req, res as Response)

      expect(
        messagesServiceStub.createMessage.calledWith(
          req.body,
          req.userId,
          req.params.chatId
        )
      ).to.be.true

      expect(
        res.sendSuccessResponse.calledWith(
          HTTPStatusCodes.Created,
          undefined,
          mockedMessage
        )
      ).to.be.true
    })

    it('Should throw UnauthorizedError if userId is NOT present in req', async () => {
      await expect(
        messagesController.createMessage(req, res as Response)
      ).to.be.rejectedWith(UnauthorizedError)
    })
  })

  describe('updateMessage', () => {
    it('Should execute chatService.updateMessage and return chat', async () => {
      req.userId = faker.string.uuid()
      req.params.id = faker.string.uuid()
      req.params.chatId = faker.string.uuid()
      req.body = {
        text: faker.lorem.sentence(),
      }

      const mockedMessage = {
        id: faker.string.uuid(),
        text: req.body.text,
      } as RowDataPacket

      messagesServiceStub.updateMessage.resolves(mockedMessage)

      await messagesController.updateMessage(req, res as Response)

      expect(
        messagesServiceStub.updateMessage.calledWith(
          req.params.id,
          req.userId,
          req.params.chatId,
          req.body
        )
      ).to.be.true

      expect(
        res.sendSuccessResponse.calledWith(
          HTTPStatusCodes.Ok,
          undefined,
          mockedMessage
        )
      ).to.be.true
    })

    it('Should throw UnauthorizedError if userId is NOT present in req', async () => {
      await expect(
        messagesController.updateMessage(req, res as Response)
      ).to.be.rejectedWith(UnauthorizedError)
    })
  })

  describe('deleteMessage', () => {
    it('Should execute chatService.deleteMessage and return success response', async () => {
      req.userId = faker.string.uuid()
      req.params.id = faker.string.uuid()
      req.params.chatId = faker.string.uuid()

      messagesServiceStub.deleteMessage.resolves()

      await messagesController.deleteMessage(req, res as Response)

      expect(
        messagesServiceStub.deleteMessage.calledWith(
          req.params.id,
          req.userId,
          req.params.chatId
        )
      ).to.be.true

      expect(
        res.sendSuccessResponse.calledWith(HTTPStatusCodes.Ok, undefined, {
          id: req.params.id,
        })
      ).to.be.true
    })

    it('Should throw UnauthorizedError if userId is NOT present in req', async () => {
      await expect(
        messagesController.deleteMessage(req, res as Response)
      ).to.be.rejectedWith(UnauthorizedError)
    })
  })
})
