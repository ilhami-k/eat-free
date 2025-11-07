import { ipcMain } from "electron";
import { UserRepository } from "./userRepository";

export function registerUserRepository() {
  const userRepository = new UserRepository();

  ipcMain.handle("userRepository:getUsers", () => {
    return userRepository.getUsers();
  });

  ipcMain.handle("userRepository:getUserById", (e, id: bigint) => {
    return userRepository.getUserById(id);
  });

  ipcMain.handle("userRepository:getUserByEmail", (e, email: string) => {
    return userRepository.getUserByEmail(email);
  });

  ipcMain.handle("userRepository:createUser", (e, email: string, name: string) => {
    return userRepository.createUser(email, name);
  });

  ipcMain.handle("userRepository:updateUser", (e, id: bigint, data: { email?: string; name?: string }) => {
    return userRepository.updateUser(id, data);
  });

  ipcMain.handle("userRepository:deleteUser", (e, id: bigint) => {
    return userRepository.deleteUser(id);
  });
}

