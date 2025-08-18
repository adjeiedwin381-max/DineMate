import { create } from 'zustand';

const useAppStore = create((set) => ({
  user: null,
  profile_image: null,
  breadcrumb: localStorage.getItem('breadcrumb') || 'Dashboard',
  setProfileImage: (image) => set({ profile_image: image }),

  setBreadcrumb: (breadcrumb) => {
    localStorage.setItem('breadcrumb', breadcrumb);
    set({ breadcrumb })
  },

  setUser: (user) => set({ user }),
  resetUser: () => set({ user: null }),
}));

export default useAppStore;