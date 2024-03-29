import { useMainStore } from "~/stores/mainStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const store = useMainStore();
  const user = store.getUser;
  if (user === null) {
    return;
  }
  if (await middleware_stepRedirectValidation()) {
    return navigateTo(`/register/step-${user.step}`);
  }
})