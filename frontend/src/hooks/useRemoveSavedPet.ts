import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { removeSavedPet } from "@/api/savedPetsApi";
import { getApiErrorMessage } from "@/api/apiError";

export function useRemoveSavedPet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeSavedPet,
    onSuccess: () => {
      toast.success("Removed from saved pets");
      queryClient.invalidateQueries({ queryKey: ["saved-pets"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
