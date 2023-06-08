import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { EditQuestionUseCase } from './edit-question'
import { makeQuestion } from 'test/factories/make-questions'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(inMemoryQuestionRepository)
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
        title: 'Nova Pergunta',
        content: 'Essa é uma nova pergunta!',
      },
      new UniqueEntityID('question-1'),
    )

    await inMemoryQuestionRepository.create(newQuestion)

    await sut.execute({
      authorId: 'author-1',
      questionId: 'question-1',
      title: 'Nova Pergunta editada',
      content: 'Essa é uma nova pergunta editada!',
    })

    expect(inMemoryQuestionRepository.items[0]).toContain({
      title: 'Nova Pergunta editada',
      content: 'Essa é uma nova pergunta editada!',
    })
  })

  it('should not be able to edit a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
        title: 'Nova Pergunta',
        content: 'Essa é uma nova pergunta!',
      },
      new UniqueEntityID('question-1'),
    )

    await inMemoryQuestionRepository.create(newQuestion)

    await expect(
      sut.execute({
        authorId: 'author-error',
        questionId: 'question-1',
        title: 'Nova Pergunta editada',
        content: 'Essa é uma nova pergunta editada!',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
