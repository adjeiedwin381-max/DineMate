import { create } from 'zustand';
import { supabase } from './supabase';
import { handleError } from '../components/Error';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

// Create the kitchen store with zustand
const useKitchenStore = create((set, get) => ({
    is_preparing: false,
    is_completed: false,
    is_cooking: false,
    is_served: false,
    is_cancelled: false,
    pendingMeals: [],
    readyMeals: [],
    servedMeals: [],
    itemsLoading: false,

    setIsPreparing: (value) => set({ is_preparing: value }),
    setIsCompleted: (value) => set({ is_completed: value }),
    setIsCooking: (value) => set({ is_cooking: value }),
    setIsServed: (value) => set({ is_served: value }),
    setIsCancelled: (value) => set({ is_cancelled: value }),

    handleFetchPendingMeals: async() => {
        set({ itemsLoading: true });
        try {
            const { data: orderItems, error } = await supabase
            .from('ordersItems')
            .select(`*, menuItems(*), orders!inner(id, tables(table_no), waiter(name))`)
            .eq('type', 'food')
            .neq('status', 'served')
            .neq('status', 'ready')
            .order('created_at', {ascending: false});

            if (error) handleError(error);

            set({ pendingMeals: orderItems, itemsLoading: false });
        } catch (error) {
            console.error("Error fetching order items:", error);
            set({ itemsLoading: false });
        }
    },

    handleFetchReadyMeals: async() => {
        set({ itemsLoading: true });
        try {
            const { data: orderItems, error } = await supabase
            .from('ordersItems')
            .select(`*, menuItems(*), orders!inner(id, tables(table_no), waiter(name))`)
            .eq('type', 'food')
            .eq('status', 'ready')
            .order('updated_at', {ascending: false});

            if (error) handleError(error);

            set({ readyMeals: orderItems, itemsLoading: false });
        } catch (error) {
            console.error("Error fetching order items:", error);
            set({ itemsLoading: false });
        }
    },

    handleFetchServedMeals: async() => {
        const fromTime = dayjs().subtract(24, 'hour').toISOString();

        set({ itemsLoading: true });
        try {
            const { data: orderItems, error } = await supabase
            .from('ordersItems')
            .select(`*, menuItems(*), orders!inner(*, waiter(name))`)
            .eq('type', 'food')
            .eq('status', 'served')
            .gte('created_at', fromTime) // Filter last 24 hours
            .order('updated_at', {ascending: false});

            if (error) handleError(error);

            set({ servedMeals: orderItems, itemsLoading: false });
        } catch (error) {
            console.error("Error fetching order items:", error);
            set({ itemsLoading: false });
        }
    },

    handleUpdateOrderItemStatus: async (dish) => {
        if (dish.status === "pending") {
            try {
                Swal.fire({
                    title: `Start cooking ${dish.menuItems?.item_name} ${dish?.menuItems?.description || ''} ???`,
                    text: "Click on item when ready",
                    icon: "warning",
                    showCancelButton: true,
                    showDenyButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#ccc9c8",
                    denyButtonColor: "#d33",
                    confirmButtonText: "Yes, start cooking!",
                    denyButtonText: `Remove order item`
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        // If the dish is pending, we can directly update it
                        const { error } = await supabase
                        .from('ordersItems')
                        .update({ status: 'cooking', updated_at: new Date() })
                        .eq('id', dish.id);
        
                        if (error) handleError(error);

                        Swal.fire({
                            icon: "success",
                            title: `${dish.menuItems?.item_name} ${dish?.menuItems?.description || ''} cooking started`,
                            text: "Click on item when ready",
                            timer: 1500
                        });

                        // ✅ Re-fetch updated items after successful update
                        get().handleFetchPendingMeals();
                    }

                    if (result.isDenied) {
                        Swal.fire({
                            title: `Remove ${dish?.menuItems?.item_name} ${dish?.menuItems?.description || ''} from order #${dish?.orders?.id}?`,
                            text: "You won't be able to revert this!",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Yes"
                        }).then(async (deleteConfirm) => {
                            if (deleteConfirm.isConfirmed) {       
                                const { error } = await supabase
                                    .from('ordersItems')
                                    .delete()
                                    .eq('id', dish?.id);
                    
                                if (error) handleError(error);
                    
                                Swal.fire({
                                    title: "Deleted!",
                                    text: `${dish?.menuItems?.item_name} ${dish?.menuItems?.description || ''} has been deleted.`,
                                    icon: "success"
                                });
                    
                                // Re-fetch updated items
                                get().handleFetchReadyMeals();
                                get().handleFetchPendingMeals();
                            }
                        });
                    }
                    
                });


            } catch (error) {
                console.error("Error updating order item status:", error);
            }
        } else if (dish.status === "cooking") {
            try {
                Swal.fire({
                    title: `${dish?.menuItems?.item_name} ${dish?.menuItems?.description || ''} ready?`,
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes"
                }).then(async (result) => {
                if (result.isConfirmed) {
                    const { error } = await supabase
                    .from('ordersItems')
                    .update({ status: 'ready' })
                    .eq('id', dish.id);
                    
                    if (error) handleError(error);

                    // ✅ Re-fetch updated items after successful update
                    get().handleFetchReadyMeals();
                    get().handleFetchPendingMeals();
                }
                });
            } catch (error) {
                console.error("Error updating order item status:", error);
            }
        } else if (dish.status === "ready") {
            try {
                // If the dish is pending, we can directly update it
                const { error } = await supabase
                .from('ordersItems')
                .update({ status: 'served' })
                .eq('id', dish.id)

                if (error) handleError(error);

                // ✅ Re-fetch updated items after successful update
                get().handleFetchReadyMeals();
                get().handleFetchServedMeals();
            } catch (error) {
                console.error("Error updating order item status:", error);
            }
        }

    },


    resetKitchenState: () => set({
        is_preparing: false,
        is_completed: false,
        is_cooking: false,
        is_served: false,
        is_cancelled: false,
    }),
}));

export default useKitchenStore;