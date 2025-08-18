import { create } from 'zustand';
import { supabase } from './supabase';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

const useReportStore = create((set) => ({
  orders: [],
  filteredOrders: [],
  waiters: [],
  cash: 0,
  balance: 0,
  card: 0,
  total: 0,
  overallCash: 0,
  overallBalance: 0,
  overallCard: 0,
  overallTotal: 0,
  loading: true,
  isFiltered: false,

  // Format number to currency
  formatNumber: (number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  },

  // Handle errors
  handleError: (error) => {
    Swal.fire({ title: "Failed", text: error.message, icon: "error" });
  },

  // Preprocess orders data
  preprocessOrders: (orders) => {
    return orders.map(order => ({
      id: order.id,
      created_at: dayjs(order.created_at).format('DD MMM YYYY, HH:mm'),
      waiter: order.waiter ? order.waiter.name : 'N/A',
      card: order.card,
      cash: order.cash,
      balance: order.balance,
      total: order.total,
    }));
  },

  // Fetch orders data
  getOrdersNow: async () => {
    try {
      let { data: orders, error } = await supabase
        .from('orders')
        .select(`*, waiter(*)`)
        .order('id', { ascending: false });

      if (error) throw error;

      const cash = orders.reduce((acc, cur) => acc + (parseFloat(cur.cash) || 0), 0).toFixed(2);
      const card = orders.reduce((acc, cur) => acc + (parseFloat(cur.card) || 0), 0).toFixed(2);
      const total = orders.reduce((acc, cur) => acc + (parseFloat(cur.total) || 0), 0).toFixed(2);
      const balance = orders.reduce((acc, cur) => acc + (parseFloat(cur.balance) || 0), 0).toFixed(2);

      set({
        balance,
        cash,
        card,
        total,
        overallBalance: balance,
        overallCash: cash,
        overallCard: card,
        overallTotal: total,
        orders: useReportStore.getState().preprocessOrders(orders),
        filteredOrders: useReportStore.getState().preprocessOrders(orders),
        loading: false,
      });
    } catch (error) {
      useReportStore.getState().handleError(error);
    }
  },

  // Fetch waiters data
  getWaiters: async () => {
    try {
      let { data: waiters, error } = await supabase.from('employees').select('*'); // Updated table name
      if (error) throw error;
      set({ waiters });
    } catch (error) {
      useReportStore.getState().handleError(error);
    }
  },

  // Filter orders based on date range and waiter
  filterOrders: (fromDate, toDate, waiterId) => {
    if (fromDate && toDate && new Date(toDate) < new Date(fromDate)) {
      console.error('The "To" date cannot be earlier than the "From" date.');
      return;
    }

    const { orders, filteredOrders: currentFilteredOrders } = useReportStore.getState();
    const start = fromDate ? new Date(fromDate) : null;
    const end = toDate ? new Date(toDate) : null;

    if (end) {
      end.setHours(23, 59, 59, 999); // Ensure the "To" date includes the entire day
    }

    console.log('Filtering orders...', { start, end, waiterId });

    const newFilteredOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at);
      const isWithinDateRange = (!start || orderDate >= start) && (!end || orderDate <= end);
      const isWaiterMatch = !waiterId || order.waiter === waiterId;
      return isWithinDateRange && isWaiterMatch;
    });

    // Avoid unnecessary state updates if the filtered results are the same
    if (JSON.stringify(newFilteredOrders) === JSON.stringify(currentFilteredOrders)) {
      return;
    }

    const cash = newFilteredOrders.reduce((acc, cur) => acc + (parseFloat(cur.cash) || 0), 0).toFixed(2);
    const card = newFilteredOrders.reduce((acc, cur) => acc + (parseFloat(cur.card) || 0), 0).toFixed(2);
    const total = newFilteredOrders.reduce((acc, cur) => acc + (parseFloat(cur.total) || 0), 0).toFixed(2);
    const balance = newFilteredOrders.reduce((acc, cur) => acc + (parseFloat(cur.balance) || 0), 0).toFixed(2);

    set({
      filteredOrders: newFilteredOrders,
      balance,
      cash,
      card,
      total,
      isFiltered: true,
    });
  },

  // Clear filters
  clearFilters: () => {
    const { orders, overallCash, overallCard, overallTotal, overallBalance } = useReportStore.getState();

    set({
      filteredOrders: orders,
      balance: overallBalance,
      cash: overallCash,
      card: overallCard,
      total: overallTotal,
      isFiltered: false,
    });
  },
}));

export default useReportStore;
