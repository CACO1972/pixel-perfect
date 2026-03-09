
-- =============================================
-- PRODUCTION RLS HARDENING - Minimum viable security
-- =============================================

-- 1. EVALUACIONES: Restrict SELECT to service_role only, keep anonymous INSERT for wizard
-- Drop overly permissive policies
DROP POLICY IF EXISTS "Permitir leer evaluaciones" ON public.evaluaciones;
DROP POLICY IF EXISTS "Permitir actualizar evaluaciones" ON public.evaluaciones;
DROP POLICY IF EXISTS "Permitir insertar evaluaciones" ON public.evaluaciones;

-- Allow anonymous INSERT (wizard flow needs this)
CREATE POLICY "anon_insert_evaluaciones" ON public.evaluaciones
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Only service_role can SELECT/UPDATE (edge functions use service_role)
-- Already covered by existing "Service role full access" policy

-- 2. CONTACTS: Enable RLS, restrict to service_role
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_contacts" ON public.contacts
  FOR ALL USING (auth.role() = 'service_role');

-- 3. CLINIC_USERS: Enable RLS, restrict to service_role
ALTER TABLE public.clinic_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_clinic_users" ON public.clinic_users
  FOR ALL USING (auth.role() = 'service_role');

-- 4. LEADS: Enable RLS, restrict to service_role
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_leads" ON public.leads
  FOR ALL USING (auth.role() = 'service_role');

-- 5. LEADS_SEGUNDA_OPINION: Enable RLS, restrict to service_role  
ALTER TABLE public.leads_segunda_opinion ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_leads_segunda_opinion" ON public.leads_segunda_opinion
  FOR ALL USING (auth.role() = 'service_role');

-- 6. LISTA_ESPERA: Enable RLS, restrict to service_role
ALTER TABLE public.lista_espera ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_lista_espera" ON public.lista_espera
  FOR ALL USING (auth.role() = 'service_role');

-- 7. NOTIFICACIONES: Enable RLS, restrict to service_role
ALTER TABLE public.notificaciones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_notificaciones" ON public.notificaciones
  FOR ALL USING (auth.role() = 'service_role');

-- 8. EVALUACION_HISTORIAL: Enable RLS, restrict to service_role
ALTER TABLE public.evaluacion_historial ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_evaluacion_historial" ON public.evaluacion_historial
  FOR ALL USING (auth.role() = 'service_role');

-- 9. IMPORT_EVENTS: Enable RLS, restrict to service_role
ALTER TABLE public.import_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_import_events" ON public.import_events
  FOR ALL USING (auth.role() = 'service_role');

-- 10. CATALOGOS: Enable RLS with public read, admin write
ALTER TABLE public.catalogo_diagnosticos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_catalogo_diagnosticos" ON public.catalogo_diagnosticos
  FOR SELECT USING (true);
CREATE POLICY "admin_write_catalogo_diagnosticos" ON public.catalogo_diagnosticos
  FOR ALL USING (public.is_admin());

ALTER TABLE public.catalogo_tratamientos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_catalogo_tratamientos" ON public.catalogo_tratamientos
  FOR SELECT USING (true);
CREATE POLICY "admin_write_catalogo_tratamientos" ON public.catalogo_tratamientos
  FOR ALL USING (public.is_admin());
