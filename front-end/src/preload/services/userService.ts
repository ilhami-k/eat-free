import { ipcRenderer } from "electron"
import IUserService from "../../shared/interfaces/IUserService"

export function userService(): IUserService {
    return { 
        getUsers: () => ipcRenderer.invoke("userRepository:getUsers"),
        getUserById: (id: bigint) => ipcRenderer.invoke("userRepository:getUserById", id),
        getUserByEmail: (email: string) => ipcRenderer.invoke("userRepository:getUserByEmail", email),
        createUser: (email: string, name: string) => ipcRenderer.invoke("userRepository:createUser", email, name),
        updateUser: (id: bigint, data: { email?: string; name?: string }) => ipcRenderer.invoke("userRepository:updateUser", id, data),
        deleteUser: (id: bigint) => ipcRenderer.invoke("userRepository:deleteUser", id)
    }
}