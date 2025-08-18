import { create } from 'zustand';
import { supabase } from './supabase';
import Swal from 'sweetalert2';
import { database_logs } from './logActivities';

const useAuthStore = create((set, get) => ({
    username: '',
    password: '',
    role: 'waiter',
    employees: [],
    selectedEmployee: null,
    loading: false,

    // Setters
    setUsername: (username) => set({ username }),
    setPassword: (password) => set({ password }),
    setRole: (role) => set({ role }),
    setSelectedEmployee: (employee) => set({ selectedEmployee: employee, username: employee?.name || '' }),

    // Fetch employees
    fetchEmployees: async () => {
        try {
            const { data, error } = await supabase.from('employees').select('*');
            if (error) throw error;
            set({ employees: data });
        } catch (error) {
            Swal.fire({ title: "Error", text: error.message, icon: "error" });
        }
    },

    // Login logic
    login: async (navigate) => {
        const { username, password } = get();
        if (!username || !password) {
            Swal.fire({ title: "Error", text: "Username and Password are required.", icon: "error" });
            return;
        }

        try {
            const { data: employees, error } = await supabase
                .from('employees')
                .select('*')
                .eq('name', username);
            if (error) throw error;

            if (employees[0]?.password === password && employees[0]?.name === username) {
                localStorage.setItem('employee', JSON.stringify(employees));
                navigate('/app/dashboard', { replace: true });
                const details = { "info": "User logged in successfully"} 
                database_logs(username, "USER_LOGGED_IN", details)
            } else {
                Swal.fire({ title: "Failed", text: 'Incorrect password', icon: "error" });
            }
        } catch (error) {
            Swal.fire({ title: "Network Error", text: 'Please check your internet and try again', icon: "error" });
        }
    },

    // Reset auth state
    resetAuth: () => {
        set({
            username: '',
            password: '',
            role: 'waiter',
            selectedEmployee: null,
            employees: [],
        });
    }
}));

export default useAuthStore;
