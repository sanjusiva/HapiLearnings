import { UserModel } from "../model/user.model";


export const deleteUserByName = async (name: string) => {
    try {
      const delUser = await UserModel.findOneAndDelete({ name: name });
      return delUser;
    } catch (err) {
      throw err; // You can handle errors more specifically if needed
    }
  };