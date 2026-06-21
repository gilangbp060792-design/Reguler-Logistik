import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('rl_auth') === 'true';
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('rl_settings');
    return saved ? JSON.parse(saved) : {
      companyName: 'Reguler Logistik',
      companyAddress: 'Jl. Sudirman No. 123, Jakarta Selatan, 12190',
      companyPhone: '021-12345678',
      timezone: 'Asia/Jakarta',
      language: 'id',
      emailNotif: true,
      pushNotif: true,
      smsNotif: false,
      appLogo: null,
      bankName: 'Bank Mandiri',
      bankAccount: '123-00-4567890-1',
      bankAccountName: 'PT. REGULER LOGISTIK',
    };
  });

  useEffect(() => { localStorage.setItem('rl_settings', JSON.stringify(settings)); }, [settings]);

  const [shipments, setShipments] = useState([]);
  const [fleet, setFleet] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
    
    // Set up realtime subscriptions (Optional, but good for Supabase)
    const channels = supabase.channel('custom-all-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shipments' }, payload => {
        if(payload.eventType === 'INSERT') setShipments(prev => [payload.new, ...prev.filter(s => s.id !== payload.new.id)]);
        else if(payload.eventType === 'UPDATE') setShipments(prev => prev.map(s => s.id === payload.new.id ? payload.new : s));
        else if(payload.eventType === 'DELETE') setShipments(prev => prev.filter(s => s.id !== payload.old.id));
      })
      .subscribe();

    return () => supabase.removeChannel(channels);
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [
        { data: shp },
        { data: flt },
        { data: drv },
        { data: act },
        { data: cust }
      ] = await Promise.all([
        supabase.from('shipments').select('*').order('created_at', { ascending: false }),
        supabase.from('fleet').select('*').order('created_at', { ascending: false }),
        supabase.from('drivers').select('*').order('created_at', { ascending: false }),
        supabase.from('activities').select('*').order('created_at', { ascending: false }),
        supabase.from('customers').select('*').order('created_at', { ascending: false })
      ]);
      
      setShipments(shp || []);
      setFleet(flt || []);
      setDrivers(drv || []);
      setActivities(act || []);
      setCustomers(cust || []);
    } catch (err) {
      console.error("Error fetching from Supabase:", err);
    } finally {
      setLoading(false);
    }
  };

  // Auth
  const login = (email, password) => {
    if (email === 'admin@regulerlogistik.com' && password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('rl_auth', 'true');
      return { success: true };
    }
    return { success: false, message: 'Invalid email or password. Use admin@regulerlogistik.com / admin123' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('rl_auth');
  };

  // Activity logger
  const addActivity = async (type, message, detail, icon, color) => {
    const newActivity = { type, message, detail, icon, color };
    // Optimistic
    const tempId = Date.now();
    setActivities(prev => [{ ...newActivity, id: tempId, created_at: new Date().toISOString() }, ...prev].slice(0, 20));
    const { error } = await supabase.from('activities').insert(newActivity);
    if(error) console.error(error);
  };

  // Shipment CRUD
  const addShipment = async (shipment) => {
    const newId = 'RL-' + String(Math.floor(10000 + Math.random() * 90000));
    const newShipment = { ...shipment, id: newId, status: 'Pending', created_at: new Date().toISOString() };
    
    setShipments(prev => [newShipment, ...prev]);
    addActivity('assigned', `New shipment ${newId} created`, `Just now • ${shipment.origin} → ${shipment.destination}`, 'sync', 'blue');
    
    await supabase.from('shipments').insert({
      id: newId,
      origin: shipment.origin,
      destination: shipment.destination,
      status: 'Pending',
      driver_id: shipment.driverId || shipment.driver_id || null,
      priority: shipment.priority,
      notes: shipment.notes,
      eta: shipment.eta,
      customer: shipment.customer,
      total_biaya: shipment.total_biaya || shipment.totalBiaya || 0,
      pengirim: shipment.pengirim,
      penerima: shipment.penerima
    });
    
    return newShipment;
  };

  const updateShipment = async (id, updates) => {
    // Map camelCase to snake_case for DB
    const dbUpdates = { ...updates };
    if(dbUpdates.driverId !== undefined) { dbUpdates.driver_id = dbUpdates.driverId; delete dbUpdates.driverId; }
    if(dbUpdates.totalBiaya !== undefined) { dbUpdates.total_biaya = dbUpdates.totalBiaya; delete dbUpdates.totalBiaya; }

    setShipments(prev => prev.map(s => s.id === id ? { ...s, ...updates, ...dbUpdates } : s));
    
    if (updates.status) {
      addActivity(
        updates.status === 'Delivered' ? 'delivered' : 'assigned',
        `Shipment ${id} status → ${updates.status}`,
        `Just now`,
        updates.status === 'Delivered' ? 'check_circle' : 'sync',
        updates.status === 'Delivered' ? 'green' : updates.status === 'Delayed' || updates.status === 'Onhold' ? 'orange' : 'blue'
      );
    }
    
    const { error } = await supabase.from('shipments').update(dbUpdates).eq('id', id);
    if(error) console.error(error);
  };

  const deleteShipment = async (id) => {
    setShipments(prev => prev.filter(s => s.id !== id));
    addActivity('alert', `Shipment ${id} deleted`, 'Just now', 'delete', 'orange');
    await supabase.from('shipments').delete().eq('id', id);
  };

  // Fleet CRUD
  const addVehicle = async (vehicle) => {
    const newId = 'VH-' + String(Math.floor(100 + Math.random() * 900));
    const newVehicle = { ...vehicle, id: newId };
    setFleet(prev => [newVehicle, ...prev]);
    addActivity('assigned', `Vehicle ${newId} added to fleet`, `Just now • ${vehicle.plate}`, 'directions_car', 'blue');
    
    await supabase.from('fleet').insert({
      id: newId,
      plate: vehicle.plate,
      type: vehicle.type,
      brand: vehicle.brand,
      capacity: vehicle.capacity,
      year: vehicle.year,
      status: vehicle.status || 'Active',
      driver_id: vehicle.driverId || null,
      mileage: vehicle.mileage || 0
    });
    return newVehicle;
  };

  const updateVehicle = async (id, updates) => {
    const dbUpdates = { ...updates };
    if(dbUpdates.driverId !== undefined) { dbUpdates.driver_id = dbUpdates.driverId; delete dbUpdates.driverId; }
    
    setFleet(prev => prev.map(v => v.id === id ? { ...v, ...updates, ...dbUpdates } : v));
    await supabase.from('fleet').update(dbUpdates).eq('id', id);
  };

  const deleteVehicle = async (id) => {
    setFleet(prev => prev.filter(v => v.id !== id));
    await supabase.from('fleet').delete().eq('id', id);
  };

  // Driver CRUD
  const addDriver = async (driver) => {
    const newId = 'DRV-' + String(Math.floor(100 + Math.random() * 900));
    const newDriver = { ...driver, id: newId, totalDeliveries: 0, joinDate: new Date().toISOString().split('T')[0] };
    setDrivers(prev => [newDriver, ...prev]);
    addActivity('onboarded', `New Driver Onboarded: ${driver.name}`, 'Just now', 'person_add', 'gray');
    
    await supabase.from('drivers').insert({
      id: newId,
      name: driver.name,
      email: driver.email,
      password: driver.password || 'password123',
      phone: driver.phone,
      status: driver.status || 'Offline',
      rating: driver.rating || 5.0,
      total_deliveries: 0,
      vehicle_id: driver.vehicleId || null,
      join_date: newDriver.joinDate
    });
    return newDriver;
  };

  const updateDriver = async (id, updates) => {
    const dbUpdates = { ...updates };
    if(dbUpdates.totalDeliveries !== undefined) { dbUpdates.total_deliveries = dbUpdates.totalDeliveries; delete dbUpdates.totalDeliveries; }
    if(dbUpdates.vehicleId !== undefined) { dbUpdates.vehicle_id = dbUpdates.vehicleId; delete dbUpdates.vehicleId; }
    if(dbUpdates.joinDate !== undefined) { dbUpdates.join_date = dbUpdates.joinDate; delete dbUpdates.joinDate; }

    setDrivers(prev => prev.map(d => d.id === id ? { ...d, ...updates, ...dbUpdates } : d));
    await supabase.from('drivers').update(dbUpdates).eq('id', id);
  };

  const deleteDriver = async (id) => {
    setDrivers(prev => prev.filter(d => d.id !== id));
    await supabase.from('drivers').delete().eq('id', id);
  };

  // Customer CRUD
  const addCustomer = async (customer) => {
    const newId = 'CUST-' + String(Math.floor(100 + Math.random() * 900));
    const newCustomer = { ...customer, id: newId };
    setCustomers(prev => [newCustomer, ...prev]);
    
    await supabase.from('customers').insert({
      id: newId,
      name: customer.name,
      pic: customer.pic,
      phone: customer.phone,
      email: customer.email,
      city: customer.city,
      province: customer.province,
      district: customer.district,
      zip: customer.zip,
      npwp: customer.npwp,
      term: customer.term,
      limit: customer.limit,
      address: customer.address
    });
    return newCustomer;
  };

  const updateCustomer = async (id, updates) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    await supabase.from('customers').update(updates).eq('id', id);
  };

  const deleteCustomer = async (id) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    await supabase.from('customers').delete().eq('id', id);
  };

  const updateSettings = (updates) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  // Computed values
  const getDriverById = (id) => drivers.find(d => d.id === id);
  const getVehicleById = (id) => fleet.find(v => v.id === id);

  const stats = {
    totalOrders: shipments.length,
    activeShipments: shipments.filter(s => ['In-Transit', 'Picked Up', 'Pending', 'Inbound', 'Onhold'].includes(s.status)).length,
    delivered: shipments.filter(s => s.status === 'Delivered').length,
    delayed: shipments.filter(s => s.status === 'Delayed').length,
    driversOnline: drivers.filter(d => d.status === 'Online').length,
    driversTotal: drivers.length,
    driverOnlinePercent: drivers.length > 0 ? Math.round((drivers.filter(d => d.status === 'Online').length / drivers.length) * 100) : 0,
    activeVehicles: fleet.filter(v => v.status === 'Active').length,
    revenue: shipments.reduce((sum, s) => sum + Number(s.total_biaya || s.totalBiaya || 0), 0),
  };

  return (
    <AppContext.Provider value={{
      isAuthenticated, login, logout, loading,
      shipments, addShipment, updateShipment, deleteShipment,
      fleet, addVehicle, updateVehicle, deleteVehicle,
      drivers, addDriver, updateDriver, deleteDriver,
      customers, addCustomer, updateCustomer, deleteCustomer,
      activities,
      settings, updateSettings,
      getDriverById, getVehicleById,
      stats,
    }}>
      {children}
    </AppContext.Provider>
  );
};
