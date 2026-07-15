CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Barbers see their bookings" ON bookings FOR SELECT USING (auth.uid() IN (SELECT user_id FROM barbers WHERE id = barber_id));
CREATE UNIQUE INDEX idx_bookings_no_double ON bookings(barber_id, date, time) WHERE status NOT IN (
  'cancelled'
);
