import User from "../user";

export default interface IUserService {
    getUsers: () => Promise<User[]>
    getUserById: (id: number) => Promise<User | null>
    getUserByEmail: (email: string) => Promise<User | null>
    createUser: (email: string, name: string) => Promise<User>
    updateUser: (id: number, data: { email?: string; name?: string }) => Promise<User>
    deleteUser: (id: number) => Promise<void>
}