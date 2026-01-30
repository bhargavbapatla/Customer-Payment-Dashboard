import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customerService } from "@/api/customerService";
import type { Customer } from "@/types/customer";
import { customerKeys } from "@/lib/queryKeys";
import { toast } from "sonner";

export const useCustomers = () => {
  return useQuery({
    queryKey: customerKeys.lists(),
    queryFn: customerService.getAll,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: customerService.add,
    onSuccess: () => {
      // 1. Invalidate cache to trigger a re-fetch
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      toast.success("Customer added successfully");
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customerService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      toast.success("Customer updated successfully");
    },
  });
};

export const useDeleteCustomers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customerService.delete,
    // Optimistic Update Example (Bonus points for performance)
    onMutate: async (deletedIds) => {
      await queryClient.cancelQueries({ queryKey: customerKeys.lists() });
      const previousCustomers = queryClient.getQueryData(customerKeys.lists());

      queryClient.setQueryData(customerKeys.lists(), (old: Customer[] | undefined) => 
        old ? old.filter(customer => !deletedIds.includes(customer.id)) : []
      );

      return { previousCustomers };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(customerKeys.lists(), context?.previousCustomers);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      toast.success("Customer(s) deleted successfully");
    },
  });
};