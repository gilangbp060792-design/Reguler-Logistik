-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabel Pelanggan (Customers)
CREATE TABLE public.customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    pic TEXT,
    phone TEXT,
    email TEXT,
    city TEXT,
    province TEXT,
    district TEXT,
    zip TEXT,
    npwp TEXT,
    term TEXT,
    "limit" TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Tabel Armada (Fleet)
CREATE TABLE public.fleet (
    id TEXT PRIMARY KEY,
    plate TEXT NOT NULL,
    type TEXT,
    brand TEXT,
    capacity TEXT,
    year INTEGER,
    status TEXT DEFAULT 'Active',
    driver_id TEXT,
    mileage INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Tabel Kurir (Drivers)
CREATE TABLE public.drivers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    status TEXT DEFAULT 'Offline',
    rating NUMERIC(3, 1),
    total_deliveries INTEGER DEFAULT 0,
    vehicle_id TEXT REFERENCES public.fleet(id) ON DELETE SET NULL,
    join_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Update Foreign Key Fleet -> Driver
ALTER TABLE public.fleet ADD CONSTRAINT fk_fleet_driver FOREIGN KEY (driver_id) REFERENCES public.drivers(id) ON DELETE SET NULL;

-- 4. Tabel Pengiriman (Shipments)
CREATE TABLE public.shipments (
    id TEXT PRIMARY KEY,
    origin TEXT,
    destination TEXT,
    status TEXT DEFAULT 'Pending',
    driver_id TEXT REFERENCES public.drivers(id) ON DELETE SET NULL,
    priority TEXT DEFAULT 'Standard',
    notes TEXT,
    eta TEXT,
    customer TEXT,
    total_biaya NUMERIC DEFAULT 0,
    
    -- JSONB untuk data bersarang (Pengirim & Penerima & Barang)
    pengirim JSONB,
    penerima JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 5. Tabel Aktivitas (Activities)
CREATE TABLE public.activities (
    id SERIAL PRIMARY KEY,
    type TEXT,
    message TEXT NOT NULL,
    detail TEXT,
    icon TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ==========================================
-- INSERT DUMMY DATA (Jalankan Jika Butuh Data Awal)
-- ==========================================

INSERT INTO public.customers (id, name, pic, phone, email, city, province, district, zip, npwp, term, "limit", address) VALUES
('CUST-001', 'PT Maju Bersama', 'Budi Santoso', '081234567890', 'budi@majubersama.com', 'Jakarta', 'DKI Jakarta', 'Kebayoran Baru', '12190', '01.234.567.8-000.000', 'Cash', '0', 'Jl. Sudirman No. 123'),
('CUST-002', 'Toko Sumber Rejeki', 'Siti Aminah', '089876543210', 'siti@sumberrejeki.com', 'Surabaya', 'Jawa Timur', 'Gubeng', '60281', '02.345.678.9-111.000', 'Net 30', '15000000', 'Jl. Pemuda No. 45'),
('CUST-003', 'PT Dummy Sejahtera', 'Andi Dummy', '08111222333', 'andi@dummy.com', 'Jakarta', 'DKI Jakarta', 'Setiabudi', '12920', '03.456.789.0-222.000', 'Net 30', '50000000', 'Jl. HR Rasuna Said Kav. 1');

INSERT INTO public.drivers (id, name, email, password, phone, status, rating, total_deliveries, join_date) VALUES
('DRV-001', 'S. Rahardian', 'drv001@reguler.com', 'password123', '+62 812-3456-7890', 'Online', 4.8, 342, '2022-03-15'),
('DRV-002', 'H. Pratama', 'drv002@reguler.com', 'password123', '+62 813-5678-9012', 'Online', 4.6, 287, '2022-06-20'),
('DRV-003', 'A. Wijaya', 'drv003@reguler.com', 'password123', '+62 815-7890-1234', 'Online', 4.3, 198, '2023-01-10');

INSERT INTO public.fleet (id, plate, type, brand, capacity, year, status, driver_id, mileage) VALUES
('VH-001', 'B 1234 ABC', 'Truck', 'Mitsubishi Colt Diesel', '5 Ton', 2022, 'Active', 'DRV-001', 45200),
('VH-002', 'B 5678 DEF', 'Van', 'Daihatsu Gran Max', '1.5 Ton', 2023, 'Active', 'DRV-002', 28100),
('VH-003', 'B 9012 GHI', 'Truck', 'Hino Dutro', '8 Ton', 2021, 'Maintenance', NULL, 78500);

UPDATE public.drivers SET vehicle_id = 'VH-001' WHERE id = 'DRV-001';
UPDATE public.drivers SET vehicle_id = 'VH-002' WHERE id = 'DRV-002';

INSERT INTO public.shipments (id, origin, destination, status, driver_id, priority, notes, eta, customer, total_biaya, created_at) VALUES
('RL-90112', 'Jakarta, ID', 'Bandung, ID', 'In-Transit', 'DRV-001', 'Standard', 'Fragile items', '14:30', 'PT Maju Bersama', 0, '2024-12-18 08:00:00'),
('RL-88241', 'Surabaya, ID', 'Malang, ID', 'Picked Up', 'DRV-002', 'Express', '', '16:15', 'CV Sentosa Jaya', 0, '2024-12-18 09:30:00'),
('RL-77123', 'Semarang, ID', 'Jakarta, ID', 'Delayed', 'DRV-003', 'Standard', 'Traffic jam on toll road', '19:00', 'PT Logistik Nusantara', 0, '2024-12-17 14:00:00'),
('RL-MAY01', 'Jakarta, ID', 'Bandung, ID', 'Delivered', 'DRV-001', 'Standard', '', '10:00', 'PT Dummy Sejahtera', 1500000, '2026-05-02 10:00:00');

INSERT INTO public.activities (type, message, detail, icon, color) VALUES
('delivered', 'Shipment #RL-9921 delivered', '2 mins ago • Driver: Sam R.', 'check_circle', 'green'),
('assigned', 'New booking assigned', '15 mins ago • Route: JKT-BDG', 'sync', 'blue'),
('alert', 'Delay Alert: Traffic Jam', '1 hour ago • Shipment #RL-4052', 'warning', 'orange');
