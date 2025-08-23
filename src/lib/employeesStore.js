import { create } from 'zustand';
import { supabase } from './supabase';
import Swal from 'sweetalert2';
import useAuthStore from './authStore';

const useEmployeesStore = create((set, get) => ({
    employees: [],
    loading: true,
    name: '',
    position: '',
    editingRow: null,
    rowData: {},
    member: {},
    role: '',
    username: '',


    // Fetch employees
    fetchMembers: async () => {
        set({ loading: true });
        try {
            const { data, error } = await supabase
                .from('restaurant_members')
                .select(`*, user:auth_users(*), restaurant(*)`)
                .eq('user_id', useAuthStore.getState().user.id)
                .eq('restaurant_id', useAuthStore.getState().restaurant.id)
                .order('name', { ascending: true });
            if (error) throw error;

            console.log(data);
            console.log(error);
            set({ members: data });
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch employees. Check your internet connection.', 'error');
        } finally {
            set({ loading: false });
        }
    },

    // Add a new employee
    handleAddEmployee: async () => {
        const { name, position } = get();
        if (!name.trim() || !position.trim()) {
            Swal.fire('Error', 'Name and Position cannot be empty.', 'error');
            return;
        }

        try {
            const { data, error } = await supabase
                .from('restaurant_members')
                .insert([{ name, position, image: '', password: '', user_id: useAuthStore.getState().user.id, restaurant_id: useAuthStore.getState().restaurant.id }]) // Add default values for image and password
                .select();
            if (error) throw error;

            Swal.fire('Success', 'Employee added successfully!', 'success');
            set((state) => ({ members: [...state.members, ...data], name: '', position: '' }));
        } catch (error) {
            Swal.fire('Error', 'Failed to add employee.', 'error');
        }
    },

    // Start editing an employee
    handleEditStart: (id, row) => {
        set({ editingRow: id, rowData: { ...row } });
    },

    // Edit employee role
    handleEditRole: async (employee) => {
        const { value: role } = await Swal.fire({
            title: `Update role of ${employee.name}`,
            input: "select",
            inputOptions: {
                admin: "Admin",
                waiter: "Waiter",
                bartender: "Bartender",
                chef: "Chef"
            },
            inputAttributes: {
              autocapitalize: "off"
            },  
            showCancelButton: true,
            inputPlaceholder: `${employee.role}`,
            confirmButtonText: "Update",
            showLoaderOnConfirm: true,
            inputValidator: (value) => {
                if (!value) {
                    return 'Please select a role';
                }
            }
          });

          if (role) {
            try {
                const { error } = await supabase
                    .from('restaurant_members')
                    .update({ role: role })
                    .eq('id', employee.id);
                if (error) throw error;

                get().fetchMembers();
                Swal.fire('Success', 'Employee role updated successfully!', 'success');
            } catch (error) {
                Swal.fire('Error', 'Failed to update employee role.', 'error');
            }
        }
    },

    // Update user status
    handleUpdateStatus: async (member) => {
        if (member.status === 'active') {
            Swal.fire({
                title: `Are you sure you want to deactivate ${member.name}?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, deactivate!"
          }).then(async (result) => {
            if (result.isConfirmed) {
                const { error } = await supabase
                    .from('restaurant_members')
                    .update({ status: 'inactive' })
                    .eq('id', member.id);
                if (error) throw error;
    
                get().fetchMembers();
                
                Swal.fire({
                  title: "Deactivated!",
                  text: `${member.name} has been deactivated.`,
                  icon: "success",
                  showConfirmButton: false,
                  timer: 1500
                });
            }
          });
        }

        if (member.status === 'inactive') {
            const { error } = await supabase
                .from('restaurant_members')
                .update({ status: 'active' })
                .eq('id', member.id);
            if (error) throw error;

            get().fetchMembers();
            
            Swal.fire({
              title: "Activated!",
              text: `${member.name} has been activated.`,
              icon: "success",
              showConfirmButton: false,
              timer: 1500
            });
        }
    },

    // Handle changes during editing
    handleEditChange: (field, value) => {
        set((state) => ({ rowData: { ...state.rowData, [field]: value } }));
    },

    // Stop editing
    handleEditStop: () => {
        set({ editingRow: null, rowData: {} });
    },

    // Save edited employee
    handleSave: async (id) => {
        const { rowData } = get();
        try {
            const { error } = await supabase
                .from('restaurant_members')
                .update({
                    name: rowData.name,
                    status: rowData.status,
                    image: rowData.image || '',
                    password: rowData.password || '',
                })
                .eq('id', id);

            if (error) throw error;

            set((state) => ({
                employees: state.employees.map((row) => (row.id === id ? { ...row, ...rowData } : row)),
                editingRow: null,
                rowData: {},
            }));
            Swal.fire('Success', 'Employee updated successfully!', 'success');
        } catch (error) {
            Swal.fire('Error', 'Failed to update employee.', 'error');
        }
    },

    // Delete an employee
    handleDelete: async (employee) => {
        Swal.fire({
            title: `Are you sure you want to delete ${employee.name}?`,
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const { error } = await supabase.from('employees').delete().eq('id', employee.id);
                    if (error) throw error;

                    get().fetchEmployees();
                    set((state) => ({
                        employees: state.employees.filter((row) => row.id !== employee.id),
                    }));
                    Swal.fire({
                      title: "Deleted!",
                      text: "Employee has been deleted.",
                      icon: "success"
                    });
                } catch (error) {
                    Swal.fire('Error', 'Failed to delete employee.', 'error');
                }
            }
        });
    },
}));

export default useEmployeesStore;
