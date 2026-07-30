import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useAppDispatch } from "@/app/hooks";
import { setCredentials } from "@/features/auth/authSlice";
import { loginApi, registerApi, type LoginPayload, type RegisterPayload } from "@/api/authApi";
import { getApiErrorMessage } from "@/api/apiError";

export function useLoginMutation() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),
    onSuccess: (data) => {
      dispatch(setCredentials({ user: data.user, token: data.token }));
      toast.success(`Welcome back, ${data.user.name}!`);
    },
    onError: (error) => {
      const message = getApiErrorMessage(error);
      toast.error(message);
    },
  });
}

export function useRegisterMutation() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerApi(payload),
    onSuccess: (data) => {
      dispatch(setCredentials({ user: data.user, token: data.token }));
      toast.success(`Account created! Welcome, ${data.user.name}.`);
    },
    onError: (error) => {
      const message = getApiErrorMessage(error);
      toast.error(message);
    },
  });
}
