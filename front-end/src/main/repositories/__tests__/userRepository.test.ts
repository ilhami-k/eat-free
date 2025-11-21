import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UserRepository } from '../userRepository'

const mockUserMethods = {
  findMany: vi.fn(),
  findUnique: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}

const mockPrismaClient = {
  user: mockUserMethods,
}

describe('UserRepository', () => {
  let repository: UserRepository

  beforeEach(() => {
    vi.clearAllMocks()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    repository = new UserRepository(mockPrismaClient as any)
  })

  describe('getUsers', () => {
    it('should return all users', async () => {
      const mockData = [
        {
          id: 1,
          email: 'user1@test.com',
          name: 'User One',
          created_at: new Date('2025-01-01'),
        },
        {
          id: 2,
          email: 'user2@test.com',
          name: 'User Two',
          created_at: new Date('2025-01-02'),
        },
      ]

      mockUserMethods.findMany.mockResolvedValue(mockData)

      const result = await repository.getUsers()

      expect(mockUserMethods.findMany).toHaveBeenCalled()
      expect(result).toHaveLength(2)
      expect(result[0].email).toBe('user1@test.com')
      expect(result[1].email).toBe('user2@test.com')
    })

    it('should return empty array when no users exist', async () => {
      mockUserMethods.findMany.mockResolvedValue([])

      const result = await repository.getUsers()

      expect(result).toEqual([])
    })
  })

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const mockData = {
        id: 1,
        email: 'user@test.com',
        name: 'Test User',
        created_at: new Date('2025-01-01'),
      }

      mockUserMethods.findUnique.mockResolvedValue(mockData)

      const result = await repository.getUserById(1)

      expect(mockUserMethods.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      })
      expect(result).toBeDefined()
      expect(result?.id).toBe(1)
      expect(result?.email).toBe('user@test.com')
    })

    it('should return null when user not found', async () => {
      mockUserMethods.findUnique.mockResolvedValue(null)

      const result = await repository.getUserById(999)

      expect(result).toBeNull()
    })
  })

  describe('getUserByEmail', () => {
    it('should return user by email', async () => {
      const mockData = {
        id: 1,
        email: 'user@test.com',
        name: 'Test User',
        created_at: new Date('2025-01-01'),
      }

      mockUserMethods.findUnique.mockResolvedValue(mockData)

      const result = await repository.getUserByEmail('user@test.com')

      expect(mockUserMethods.findUnique).toHaveBeenCalledWith({
        where: { email: 'user@test.com' },
      })
      expect(result).toBeDefined()
      expect(result?.email).toBe('user@test.com')
    })

    it('should return null when email not found', async () => {
      mockUserMethods.findUnique.mockResolvedValue(null)

      const result = await repository.getUserByEmail('nonexistent@test.com')

      expect(result).toBeNull()
    })
  })

  describe('createUser', () => {
    it('should create new user', async () => {
      const mockData = {
        id: 5,
        email: 'newuser@test.com',
        name: 'New User',
        created_at: new Date('2025-01-01'),
      }

      mockUserMethods.create.mockResolvedValue(mockData)

      const result = await repository.createUser('newuser@test.com', 'New User')

      expect(mockUserMethods.create).toHaveBeenCalledWith({
        data: {
          email: 'newuser@test.com',
          name: 'New User',
        },
      })
      expect(result.id).toBe(5)
      expect(result.email).toBe('newuser@test.com')
      expect(result.name).toBe('New User')
    })
  })

  describe('updateUser', () => {
    it('should update user email', async () => {
      const mockData = {
        id: 1,
        email: 'updated@test.com',
        name: 'Test User',
        created_at: new Date('2025-01-01'),
      }

      mockUserMethods.update.mockResolvedValue(mockData)

      const result = await repository.updateUser(1, { email: 'updated@test.com' })

      expect(mockUserMethods.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { email: 'updated@test.com' },
      })
      expect(result.email).toBe('updated@test.com')
    })

    it('should update user name', async () => {
      const mockData = {
        id: 1,
        email: 'user@test.com',
        name: 'Updated Name',
        created_at: new Date('2025-01-01'),
      }

      mockUserMethods.update.mockResolvedValue(mockData)

      const result = await repository.updateUser(1, { name: 'Updated Name' })

      expect(result.name).toBe('Updated Name')
    })

    it('should update both email and name', async () => {
      const mockData = {
        id: 1,
        email: 'new@test.com',
        name: 'New Name',
        created_at: new Date('2025-01-01'),
      }

      mockUserMethods.update.mockResolvedValue(mockData)

      const result = await repository.updateUser(1, {
        email: 'new@test.com',
        name: 'New Name',
      })

      expect(result.email).toBe('new@test.com')
      expect(result.name).toBe('New Name')
    })
  })

  describe('deleteUser', () => {
    it('should delete user by id', async () => {
      mockUserMethods.delete.mockResolvedValue({})

      await repository.deleteUser(1)

      expect(mockUserMethods.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      })
    })
  })
})
