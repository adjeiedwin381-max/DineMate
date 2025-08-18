import { create } from 'zustand';
import { supabase } from './supabase';
import { handleError } from '../components/Error';
import Swal from 'sweetalert2';
import useMenuStore from './menuStore';


const useTablesStore = create((set, get) => ({
    tables: [],
    employee: [],
    tableStatus: 'all',
    openAvailable: false,
    open: false,
    selectedTable: null,
    assignEmployee: 0,
    order: [],
    items: [],
    totalQty: 0,
    totalPrice: 0,
    employees: [],
    loading: true,
    itemsLoading: true,

    setTableStatus: (status) => set({ tableStatus: status }),
    setOpenAvailable: (open) => set({ openAvailable: open }),
    setOpen: (open) => set({ open: open }),
    setSelectedTable: (table) => set({ selectedTable: table }),
    setAssignEmployee: (employee) => set({ assignEmployee: employee }),
    setOrder: (order) => set({ order: order }),
    setItems: (items) => set({ items: items }),
    setTotalQty: (qty) => set({ totalQty: qty }),
    setTotalPrice: (price) => set({ totalPrice: price }),
    setLoading: (loading) => set({ loading: loading }),
    setItemsLoading: (loading) => set({ itemsLoading: loading }),

    preprocessTables: (tables) => {
        return tables.map(table => ({
            ...table,
            waiterName: table.assign && table.assign.name ? table.assign.name : 'Unknown'
        }));
    },

    getTables: async () => {
        try {
            set({ loading: true });
            const { employee } = get();
            let query = supabase.from('tables').select(`*, assign(*)`).order('table_no', { ascending: true });

            if (employee.role === 'waiter') {
                query = query.or(`assign.eq.${employee.id},status.eq.available`);
            }

            let { data: tables, error } = await query;

            if (error) throw error;

            set({ tables: get().preprocessTables(tables), loading: false });
        } catch (error) {
            handleError(error);
            set({ loading: false });
        }
    },

    getEmployee: async () => {
        let employeeStringified = localStorage.getItem('employee');
        const employeeParsed = JSON.parse(employeeStringified);
        set({ employee: employeeParsed[0] });
    },

    getEmployees: async () => {
        try {
            let { data: employees, error } = await supabase.from('employees').select('*');
            if (error) throw error;
            set({ employees });
        } catch (error) {
            handleError(error);
        }
    },

    getTablesByStatus: async (tableStatus) => {
        try {
            set({ loading: true });
            const { employee } = get();
            let query = supabase.from('tables').select(`*, assign(*)`).order('table_no', { ascending: true });

            if (tableStatus !== 'all') {
                query = query.eq('status', tableStatus);
            }

            if (employee.role === 'waiter') {
                query = query.or(`assign.eq.${employee.id},status.eq.available`);
            }

            let { data: tables, error } = await query;

            if (error) throw error;

            set({ tables: get().preprocessTables(tables), loading: false });
        } catch (error) {
            handleError(error);
            set({ loading: false });
        }
    },

    handleAssign: async (table, employee) => {
        if (employee.role === 'admin') {
            set({ openAvailable: true, selectedTable: table });
        } else if (employee.role === 'waiter') {
            try {
                const { error: tablesError } = await supabase
                    .from('tables')
                    .update({ status: 'occupied', assign: employee.id })
                    .eq('table_no', table.table_no)
                    .select();

                if (tablesError) throw tablesError;
                console.log(`Table ${table.table_no} assigned to ${employee.name}`)

                const { error: ordersError } = await supabase
                    .from('orders')
                    .insert([{ table: table.id, waiter: employee.id }])
                    .select();

                if (ordersError) throw ordersError;

                get().getTables();
                Swal.fire({ showConfirmButton: false, icon: 'success', timer: 2000 });
            } catch (error) {
                handleError(error);
            }
        }
    },

    handleAssignAdmin: async (e) => {
        const { selectedTable } = get();
        try {
            const { error: tablesError } = await supabase
                .from('tables')
                .update({ status: 'occupied', assign: e.target.value })
                .eq('table_no', selectedTable.table_no)
                .select();

            if (tablesError) throw tablesError;

            const { error: ordersError } = await supabase
                .from('orders')
                .insert([{ table: selectedTable.id, waiter: e.target.value }])
                .select();

            if (ordersError) throw ordersError;

            get().getTables();
            set({ openAvailable: false });
            Swal.fire({ showConfirmButton: false, icon: 'success', timer: 2000 });
        } catch (error) {
            handleError(error);
        }
    },

    handleResetTable: async (table) => {
        // Access setTableSelected from menuStore
        const setTableSelected = useMenuStore.getState().setTableSelected; 
        
        try {
            await supabase.from('orders').delete().eq('table', table.id);
            await supabase.from('tables').update({ status: 'available', assign: null }).eq('id', table.id).select();
            get().getTables();
            set({ open: false });
            setTableSelected();
            Swal.fire({ showConfirmButton: false, icon: 'success', timer: 2000 });
        } catch (error) {
            handleError(error);
        }
    },

    handleOpenOccupied: async (item, employee) => {
        set({ selectedTable: item, open: true, itemsLoading: true });

        let { data: orders, error } = await supabase
            .from('orders')
            .select(`*, waiter(*)`)
            .eq('table', item.id)
            .eq('status', 'pending');

        if (employee.status === 'waiter') {
            orders = orders.filter(order => order.waiter.id === employee.id);
        }

        if (orders.length === 0 && employee.status === 'waiter') {
            set({ open: false });
            Swal.fire({ title: "Access Denied", text: "You cannot open orders assigned to other waiters.", icon: "error" });
            return;
        }

        set({ order: orders[0] });

        if (error) {
            console.log(error);
        } else {
            if (orders.length === 0) {
                set({ items: [], itemsLoading: false });
            } else {
                let { data: ordersItems, error } = await supabase
                    .from('ordersItems')
                    .select(`*, menuItems(*), drinks(*), orders!inner(*, waiter(*), table(*))`)
                    .eq('order_no', orders[0].id);

                if (error) handleError(error)

                set({ items: ordersItems, itemsLoading: false });

                const totalQuantity = ordersItems.reduce((acc, cur) => acc + cur.quantity, 0);
                const total = ordersItems.reduce((acc, cur) => acc + cur.total, 0);
                set({ totalQty: totalQuantity, totalPrice: total });
            }
        }
    },

    handleClose: () => {
        set({ open: false, itemsLoading: true });
    },

    handleCloseAvailable: () => {
        set({ openAvailable: false });
    },

    handleFilterTable: (tableStatus) => {
        set({ tableStatus });
    }
}));

export default useTablesStore;
