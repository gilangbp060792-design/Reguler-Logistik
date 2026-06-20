import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

// Sample data
const INITIAL_SHIPMENTS = [
  { id: 'RL-90112', origin: 'Jakarta, ID', destination: 'Bandung, ID', status: 'In-Transit', driverId: 'DRV-001', priority: 'Standard', notes: 'Fragile items', createdAt: '2024-12-18T08:00:00', eta: '14:30', customer: 'PT Maju Bersama' },
  { id: 'RL-88241', origin: 'Surabaya, ID', destination: 'Malang, ID', status: 'Picked Up', driverId: 'DRV-002', priority: 'Express', notes: '', createdAt: '2024-12-18T09:30:00', eta: '16:15', customer: 'CV Sentosa Jaya' },
  { id: 'RL-77123', origin: 'Semarang, ID', destination: 'Jakarta, ID', status: 'Delayed', driverId: 'DRV-003', priority: 'Standard', notes: 'Traffic jam on toll road', createdAt: '2024-12-17T14:00:00', eta: '19:00', customer: 'PT Logistik Nusantara' },
  { id: 'RL-65432', origin: 'Yogyakarta, ID', destination: 'Solo, ID', status: 'Delivered', driverId: 'DRV-004', priority: 'Standard', notes: '', createdAt: '2024-12-17T07:00:00', eta: '10:00', customer: 'Toko Bahagia' },
  { id: 'RL-54321', origin: 'Medan, ID', destination: 'Padang, ID', status: 'Delivered', driverId: 'DRV-005', priority: 'Express', notes: '', createdAt: '2024-12-16T06:00:00', eta: '18:00', customer: 'CV Andalas Express' },
  { id: 'RL-43210', origin: 'Makassar, ID', destination: 'Manado, ID', status: 'Pending', driverId: null, priority: 'Standard', notes: 'Awaiting driver assignment', createdAt: '2024-12-18T11:00:00', eta: '-', customer: 'PT Sulawesi Cargo' },
  { id: 'RL-32109', origin: 'Bali, ID', destination: 'Surabaya, ID', status: 'In-Transit', driverId: 'DRV-001', priority: 'Express', notes: '', createdAt: '2024-12-18T05:00:00', eta: '15:00', customer: 'Bali Shipping Co' },
  { id: 'RL-21098', origin: 'Jakarta, ID', destination: 'Cirebon, ID', status: 'Delivered', driverId: 'DRV-002', priority: 'Standard', notes: '', createdAt: '2024-12-15T08:00:00', eta: '14:00', customer: 'PT Pantura Jaya' },
];

const INITIAL_CUSTOMERS = [
  { id: 'CUST-001', name: 'PT Maju Bersama', pic: 'Budi Santoso', phone: '081234567890', email: 'budi@majubersama.com', city: 'Jakarta', province: 'DKI Jakarta', district: 'Kebayoran Baru', zip: '12190', npwp: '01.234.567.8-000.000', term: 'Cash', limit: '0', address: 'Jl. Sudirman No. 123' },
  { id: 'CUST-002', name: 'Toko Sumber Rejeki', pic: 'Siti Aminah', phone: '089876543210', email: 'siti@sumberrejeki.com', city: 'Surabaya', province: 'Jawa Timur', district: 'Gubeng', zip: '60281', npwp: '02.345.678.9-111.000', term: 'Net 30', limit: '15000000', address: 'Jl. Pemuda No. 45' },
];

const INITIAL_FLEET = [
  { id: 'VH-001', plate: 'B 1234 ABC', type: 'Truck', brand: 'Mitsubishi Colt Diesel', capacity: '5 Ton', year: 2022, status: 'Active', driverId: 'DRV-001', mileage: 45200 },
  { id: 'VH-002', plate: 'B 5678 DEF', type: 'Van', brand: 'Daihatsu Gran Max', capacity: '1.5 Ton', year: 2023, status: 'Active', driverId: 'DRV-002', mileage: 28100 },
  { id: 'VH-003', plate: 'B 9012 GHI', type: 'Truck', brand: 'Hino Dutro', capacity: '8 Ton', year: 2021, status: 'Maintenance', driverId: null, mileage: 78500 },
  { id: 'VH-004', plate: 'D 3456 JKL', type: 'Van', brand: 'Suzuki APV', capacity: '1 Ton', year: 2023, status: 'Active', driverId: 'DRV-004', mileage: 15600 },
  { id: 'VH-005', plate: 'L 7890 MNO', type: 'Motorcycle', brand: 'Honda Vario 160', capacity: '20 Kg', year: 2024, status: 'Active', driverId: 'DRV-005', mileage: 5200 },
  { id: 'VH-006', plate: 'H 2345 PQR', type: 'Truck', brand: 'Isuzu Elf', capacity: '4 Ton', year: 2020, status: 'Inactive', driverId: null, mileage: 92000 },
];

const INITIAL_DRIVERS = [
  { id: 'DRV-001', name: 'S. Rahardian', email: 'drv001@reguler.com', password: 'password123', phone: '+62 812-3456-7890', status: 'Online', rating: 4.8, totalDeliveries: 342, vehicleId: 'VH-001', joinDate: '2022-03-15' },
  { id: 'DRV-002', name: 'H. Pratama', email: 'drv002@reguler.com', password: 'password123', phone: '+62 813-5678-9012', status: 'Online', rating: 4.6, totalDeliveries: 287, vehicleId: 'VH-002', joinDate: '2022-06-20' },
  { id: 'DRV-003', name: 'A. Wijaya', email: 'drv003@reguler.com', password: 'password123', phone: '+62 815-7890-1234', status: 'Online', rating: 4.3, totalDeliveries: 198, vehicleId: null, joinDate: '2023-01-10' },
  { id: 'DRV-004', name: 'R. Kusuma', email: 'drv004@reguler.com', password: 'password123', phone: '+62 817-9012-3456', status: 'Offline', rating: 4.9, totalDeliveries: 512, vehicleId: 'VH-004', joinDate: '2021-08-05' },
  { id: 'DRV-005', name: 'M. Fadli', email: 'drv005@reguler.com', password: 'password123', phone: '+62 818-1234-5678', status: 'Online', rating: 4.5, totalDeliveries: 156, vehicleId: 'VH-005', joinDate: '2023-09-01' },
  { id: 'DRV-006', name: 'B. Santoso', email: 'drv006@reguler.com', password: 'password123', phone: '+62 819-2345-6789', status: 'Offline', rating: 4.7, totalDeliveries: 423, vehicleId: null, joinDate: '2021-02-14' },
];

const INITIAL_ACTIVITIES = [
  { id: 1, type: 'delivered', message: 'Shipment #RL-9921 delivered', detail: '2 mins ago • Driver: Sam R.', icon: 'check_circle', color: 'green' },
  { id: 2, type: 'assigned', message: 'New booking assigned', detail: '15 mins ago • Route: JKT-BDG', icon: 'sync', color: 'blue' },
  { id: 3, type: 'alert', message: 'Delay Alert: Traffic Jam', detail: '1 hour ago • Shipment #RL-4052', icon: 'warning', color: 'orange' },
  { id: 4, type: 'onboarded', message: 'New Driver Onboarded', detail: '3 hours ago • Alex Morgan', icon: 'person_add', color: 'gray' },
];

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('rl_auth') === 'true';
  });

  const [shipments, setShipments] = useState(() => {
    const saved = localStorage.getItem('rl_shipments');
    return saved ? JSON.parse(saved) : INITIAL_SHIPMENTS;
  });

  const [fleet, setFleet] = useState(() => {
    const saved = localStorage.getItem('rl_fleet');
    return saved ? JSON.parse(saved) : INITIAL_FLEET;
  });

  const [drivers, setDrivers] = useState(() => {
    const saved = localStorage.getItem('rl_drivers');
    return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
  });

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('rl_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('rl_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('rl_settings');
    return saved ? JSON.parse(saved) : {
      companyName: 'Reguler Logistik',
      companyAddress: 'Jl. Sudirman No. 123, Jakarta Selatan, 12190',
      timezone: 'Asia/Jakarta',
      language: 'id',
      emailNotif: true,
      pushNotif: true,
      smsNotif: false,
      appLogo: null,
    };
  });

  // Persist to localStorage
  useEffect(() => { localStorage.setItem('rl_shipments', JSON.stringify(shipments)); }, [shipments]);
  useEffect(() => { localStorage.setItem('rl_fleet', JSON.stringify(fleet)); }, [fleet]);
  useEffect(() => { localStorage.setItem('rl_drivers', JSON.stringify(drivers)); }, [drivers]);
  useEffect(() => { localStorage.setItem('rl_activities', JSON.stringify(activities)); }, [activities]);
  useEffect(() => { localStorage.setItem('rl_customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('rl_settings', JSON.stringify(settings)); }, [settings]);

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
  const addActivity = (type, message, detail, icon, color) => {
    const newActivity = { id: Date.now(), type, message, detail, icon, color };
    setActivities(prev => [newActivity, ...prev].slice(0, 20));
  };

  // Shipment CRUD
  const addShipment = (shipment) => {
    const newId = 'RL-' + String(Math.floor(10000 + Math.random() * 90000));
    const newShipment = { ...shipment, id: newId, status: 'Pending', createdAt: new Date().toISOString() };
    setShipments(prev => [newShipment, ...prev]);
    addActivity('assigned', `New shipment ${newId} created`, `Just now • ${shipment.origin} → ${shipment.destination}`, 'sync', 'blue');
    return newShipment;
  };

  const updateShipment = (id, updates) => {
    setShipments(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    if (updates.status) {
      addActivity(
        updates.status === 'Delivered' ? 'delivered' : 'assigned',
        `Shipment ${id} status → ${updates.status}`,
        `Just now`,
        updates.status === 'Delivered' ? 'check_circle' : 'sync',
        updates.status === 'Delivered' ? 'green' : updates.status === 'Delayed' ? 'orange' : 'blue'
      );
    }
  };

  const deleteShipment = (id) => {
    setShipments(prev => prev.filter(s => s.id !== id));
    addActivity('alert', `Shipment ${id} deleted`, 'Just now', 'delete', 'orange');
  };

  // Fleet CRUD
  const addVehicle = (vehicle) => {
    const newId = 'VH-' + String(Math.floor(100 + Math.random() * 900));
    const newVehicle = { ...vehicle, id: newId };
    setFleet(prev => [newVehicle, ...prev]);
    addActivity('assigned', `Vehicle ${newId} added to fleet`, `Just now • ${vehicle.plate}`, 'directions_car', 'blue');
    return newVehicle;
  };

  const updateVehicle = (id, updates) => {
    setFleet(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
  };

  const deleteVehicle = (id) => {
    setFleet(prev => prev.filter(v => v.id !== id));
  };

  // Driver CRUD
  const addDriver = (driver) => {
    const newId = 'DRV-' + String(Math.floor(100 + Math.random() * 900));
    const newDriver = { ...driver, id: newId, totalDeliveries: 0, joinDate: new Date().toISOString().split('T')[0] };
    setDrivers(prev => [newDriver, ...prev]);
    addActivity('onboarded', `New Driver Onboarded: ${driver.name}`, 'Just now', 'person_add', 'gray');
    return newDriver;
  };

  const updateDriver = (id, updates) => {
    setDrivers(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const deleteDriver = (id) => {
    setDrivers(prev => prev.filter(d => d.id !== id));
  };

  // Customer CRUD
  const addCustomer = (customer) => {
    const newId = 'CUST-' + String(Math.floor(100 + Math.random() * 900));
    const newCustomer = { ...customer, id: newId };
    setCustomers(prev => [newCustomer, ...prev]);
    return newCustomer;
  };

  const updateCustomer = (id, updates) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCustomer = (id) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  // Settings
  const updateSettings = (updates) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  // Computed values
  const getDriverById = (id) => drivers.find(d => d.id === id);
  const getVehicleById = (id) => fleet.find(v => v.id === id);

  const stats = {
    totalOrders: shipments.length,
    activeShipments: shipments.filter(s => ['In-Transit', 'Picked Up', 'Pending'].includes(s.status)).length,
    delivered: shipments.filter(s => s.status === 'Delivered').length,
    delayed: shipments.filter(s => s.status === 'Delayed').length,
    driversOnline: drivers.filter(d => d.status === 'Online').length,
    driversTotal: drivers.length,
    driverOnlinePercent: drivers.length > 0 ? Math.round((drivers.filter(d => d.status === 'Online').length / drivers.length) * 100) : 0,
    activeVehicles: fleet.filter(v => v.status === 'Active').length,
    revenue: 142000,
  };

  return (
    <AppContext.Provider value={{
      isAuthenticated, login, logout,
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
