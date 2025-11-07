import User from "../user";

export default interface IUserService {
    getUsers: () => Promise<User[]>
    getUserById: (id: bigint) => Promise<User | null>
    getUserByEmail: (email: string) => Promise<User | null>
    createUser: (email: string, name: string) => Promise<User>
    updateUser: (id: bigint, data: { email?: string; name?: string }) => Promise<User>
    deleteUser: (id: bigint) => Promise<void>
}