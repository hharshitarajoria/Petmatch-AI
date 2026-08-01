import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { fetchSavedPets, savePet } from "@/api/savedPetsApi";
import { getApiErrorMessage } from "@/api/apiError";

export function useSavedPets(page: number) {
  return useQuery({
    queryKey: ["saved-pets", page],
    queryFn: () => fetchSavedPets(page),
    placeholderData: keepPreviousData,
  });
}

export function useSavePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (petId: string) => savePet(petId),
    onSuccess: () => {
      toast.success("Pet saved");
      queryClient.invalidateQueries({ queryKey: ["saved-pets"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
