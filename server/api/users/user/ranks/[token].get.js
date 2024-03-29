import { getAuth } from 'firebase-admin/auth';
import Users from "~~/server/models/user";

export default defineEventHandler(async (event) => {
  const { token } = event.context.params;
  const result = await getAuth().verifyIdToken(token);
  try {
    if (result) {
      const document = await Users.findOne({user_uid: result.uid});
      return {
        data: document.user_ranks,
        success: true,
      }
    } else {
      return {
        data: false,
        success: false,
        message: 'User not authenticated',
        code: 400,
      }
    }
  } catch (err) {
    return err
  }
 })