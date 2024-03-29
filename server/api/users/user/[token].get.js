import { getAuth } from 'firebase-admin/auth';
import Users from "~~/server/models/user";

export default defineEventHandler(async (event) => {
  const { token } = event.context.params;
  const result = await getAuth().verifyIdToken(token);
  try {
    if (result) {
      const document = await Users.findOne({user_uid: result.uid});
      return {
        data: {
          register_step: document.register_step,
          stripe_status: document.stripe_status,
          stripe_plan: document.stripe_plan,
          // expires: document.stripe_plan.cancel_at,
        },
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
    console.log(err)
    return {
      data: false,
      success: false,
      message: 'Catch Error',
      code: 400,
    }
  }
 })