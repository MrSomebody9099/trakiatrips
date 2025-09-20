-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'email_only' CHECK (status IN ('email_only', 'booking_started', 'booking_confirmed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_email VARCHAR(255) NOT NULL,
    package_name VARCHAR(100) NOT NULL,
    package_type VARCHAR(100) NOT NULL,
    number_of_guests INTEGER NOT NULL,
    total_amount INTEGER NOT NULL, -- Amount in cents
    payment_plan VARCHAR(20) DEFAULT 'full' CHECK (payment_plan IN ('full', 'installment')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed')),
    lead_booker_name VARCHAR(255),
    lead_booker_phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (lead_email) REFERENCES leads(email) ON DELETE CASCADE
);

-- Create guests table
CREATE TABLE IF NOT EXISTS guests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    date_of_birth DATE,
    is_lead_booker BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_bookings_lead_email ON bookings(lead_email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_guests_booking_id ON guests(booking_id);

-- Insert some sample data for testing (optional)
-- INSERT INTO leads (email, status) VALUES ('test@example.com', 'email_only') ON CONFLICT DO NOTHING;