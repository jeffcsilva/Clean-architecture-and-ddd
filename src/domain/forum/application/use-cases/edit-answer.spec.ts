import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { EditAnswerUseCase } from './edit-answer'
import { makeAnswer } from 'test/factories/make-answers'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryAnswerRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(inMemoryAnswerRepository)
  })

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
        content: 'Essa é uma nova pergunta!',
      },
      new UniqueEntityID('answer-1'),
    )
    inMemoryAnswerRepository.create(newAnswer)

    await sut.execute({
      authorId: 'author-1',
      answerId: 'answer-1',
      content: 'Essa é uma nova pergunta editada!',
    })

    expect(inMemoryAnswerRepository.items[0]).toContain({
      content: 'Essa é uma nova pergunta editada!',
    })
  })

  it('should not be able to edit a answer from another user', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
        content: 'Essa é uma nova pergunta!',
      },
      new UniqueEntityID('answer-1'),
    )
    inMemoryAnswerRepository.create(newAnswer)

    await expect(
      sut.execute({
        authorId: 'author-error',
        answerId: 'answer-1',
        content: 'Essa é uma nova pergunta editada!',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
