import { create } from 'zustand';
import { supabase } from './supabase';
import Swal from 'sweetalert2';
import { handleError } from '../components/Error';
import useMenuStore from './menuStore';

const useAdminTablesStore = create((set, get) => ({
    open: false,
    openAvailable: false,
    tables: [],
    loading: true,
    table_no: '',
    status: '',
    items: [],
    editingRow: null,
    rowData: {},
    itemsLoading: true,
    employee: [],
    employees: [],
    assignEmployee: 0,
    order: [],
    totalQty: 0,
    totalPrice: 0,
 
    // Set assign employee
    setAssignEmployee: (employee) => set({ assignEmployee: employee }),

    // Get employee
    getEmployee: async () => {
        let employeeStringified = localStorage.getItem('employee');
        const employeeParsed = JSON.parse(employeeStringified);
        set({ employee: employeeParsed[0] });
    },

    // Get employees
    getEmployees: async () => {
        try {
            let { data: employees, error } = await supabase.from('employees').select('*');
            if (error) throw error;
            set({ employees });
        } catch (error) {
            handleError(error);
        }
    },

    // Set total quantity
    setTotalQty: (qty) => set({ totalQty: qty }),
    
    // Set total price
    setTotalPrice: (price) => set({ totalPrice: price }),

    // Set order
    setOrder: (order) => set({ order: order }),

    // Set items loading
    setItemsLoading: (loading) => set({ itemsLoading: loading }),

    // Preprocess tables
    preprocessTables: (tables) => {
        return tables.map(table => ({
            ...table,
            waiterName: table.assign && table.assign.name ? table.assign.name : 'Unknown'
        }));
    },

    // Fetch tables
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

    // Add a new table
    handleAddTable: async () => {
        const { table_no, status } = get();
        if (!table_no.trim()) {
            Swal.fire('Error', 'Table number cannot be empty.', 'error');
            return;
        }

        try {
            const { data: existingTables, error: fetchError } = await supabase
                .from('tables')
                .select('table_no')
                .eq('table_no', table_no);

            if (fetchError) throw fetchError;

            if (existingTables.length > 0) {
                Swal.fire('Error', 'Table number already exists. Please choose a different number.', 'error');
                return;
            }

            const { data, error } = await supabase
                .from('tables')
                .insert([{ table_no, status: status || 'available' }])
                .select();

            if (error) throw error;

            Swal.fire('Success', 'Table added successfully!', 'success');
            set((state) => ({ tables: [...state.tables, ...data], table_no: '', status: '' }));
        } catch (error) {
            Swal.fire('Error', 'Failed to add table.', 'error');
        }
    },

    // Start editing a table
    handleEditStart: (id, row) => {
        set({ editingRow: id, rowData: { ...row } });
    },

    // Handle changes during editing
    handleEditChange: (field, value) => {
        set((state) => ({ rowData: { ...state.rowData, [field]: value } }));
    },

    // Stop editing
    handleEditStop: () => {
        set({ editingRow: null, rowData: {} });
    },

    // Save edited table
    handleSave: async (id) => {
        const { rowData } = get();
        try {
            const { error } = await supabase
                .from('tables')
                .update({ table_no: rowData.table_no, status: rowData.status })
                .eq('id', id);

            if (error) throw error;

            set((state) => ({
                tables: state.tables.map((row) => (row.id === id ? { ...row, ...rowData } : row)),
                editingRow: null,
                rowData: {},
            }));
            Swal.fire('Success', 'Table updated successfully!', 'success');
        } catch (error) {
            Swal.fire('Error', 'Failed to update table.', 'error');
        }
    },

    // Delete a table
    handleDelete: async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const { error } = await supabase.from('tables').delete().eq('id', id);
                    if (error) throw error;

                    set((state) => ({
                        tables: state.tables.filter((row) => row.id !== id),
                    }));
                    Swal.fire('Deleted!', 'Table has been deleted.', 'success');
                } catch (error) {
                    Swal.fire('Error', 'Failed to delete table.', 'error');
                }
            }
        });
    },

    // Assign a table to a waiter
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

    // Assign a table to an admin
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

    // Reset a table
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

    // Open an occupied table
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

    // Close modals
    handleClose: () => {
        set({ open: false, itemsLoading: true });
    },

    // Close available modal
    handleCloseAvailable: () => {
        set({ openAvailable: false });
    },

}));

export default useAdminTablesStore;
