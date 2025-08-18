import { create } from 'zustand';
import { supabase } from './supabase';
import Swal from 'sweetalert2';

const useProfileStore = create((set) => ({
    profile: [],
    loading: true,
    name: '',
    position: '',
    editingRow: null,
    rowData: {},
    

    // Get profile
    getProfile: async () => {
        const user = JSON.parse(localStorage.getItem('employee'));

        set({ profile: user[0] });
    },
}));

export default useProfileStore;
