
-- Table to store patient portal credentials (RUT + password)
CREATE TABLE public.patient_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rut text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  name text,
  dentalink_patient_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS: only service_role can access (edge function uses service role)
ALTER TABLE public.patient_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_patient_credentials"
  ON public.patient_credentials
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
