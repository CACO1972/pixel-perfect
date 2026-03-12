export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      analyses: {
        Row: {
          buccal_corridor_left: number | null
          buccal_corridor_right: number | null
          created_at: string
          facial_midline_deviation_mm: number | null
          facial_symmetry_score: number | null
          facial_thirds_ratio: Json | null
          frontal_rest_url: string | null
          frontal_smile_url: string | null
          gingival_display_mm: number | null
          id: string
          midline_deviation_mm: number | null
          mode: Database["public"]["Enums"]["analysis_mode"]
          raw_ai_payload: Json | null
          smile_score: number | null
          smile_simulation_url: string | null
          user_id: string
        }
        Insert: {
          buccal_corridor_left?: number | null
          buccal_corridor_right?: number | null
          created_at?: string
          facial_midline_deviation_mm?: number | null
          facial_symmetry_score?: number | null
          facial_thirds_ratio?: Json | null
          frontal_rest_url?: string | null
          frontal_smile_url?: string | null
          gingival_display_mm?: number | null
          id?: string
          midline_deviation_mm?: number | null
          mode?: Database["public"]["Enums"]["analysis_mode"]
          raw_ai_payload?: Json | null
          smile_score?: number | null
          smile_simulation_url?: string | null
          user_id: string
        }
        Update: {
          buccal_corridor_left?: number | null
          buccal_corridor_right?: number | null
          created_at?: string
          facial_midline_deviation_mm?: number | null
          facial_symmetry_score?: number | null
          facial_thirds_ratio?: Json | null
          frontal_rest_url?: string | null
          frontal_smile_url?: string | null
          gingival_display_mm?: number | null
          id?: string
          midline_deviation_mm?: number | null
          mode?: Database["public"]["Enums"]["analysis_mode"]
          raw_ai_payload?: Json | null
          smile_score?: number | null
          smile_simulation_url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      analysis_3d: {
        Row: {
          analysis_id: string
          created_at: string
          model_glb_url: string | null
          status_3d: Database["public"]["Enums"]["status_3d"]
          updated_at: string
          wavespeed_task_id: string | null
        }
        Insert: {
          analysis_id: string
          created_at?: string
          model_glb_url?: string | null
          status_3d?: Database["public"]["Enums"]["status_3d"]
          updated_at?: string
          wavespeed_task_id?: string | null
        }
        Update: {
          analysis_id?: string
          created_at?: string
          model_glb_url?: string | null
          status_3d?: Database["public"]["Enums"]["status_3d"]
          updated_at?: string
          wavespeed_task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analysis_3d_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: true
            referencedRelation: "analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          created_at: string
          event_category: string | null
          event_data: Json | null
          event_type: string
          id: string
          lead_id: string | null
          profile_id: string | null
          referrer: string | null
          session_id: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          created_at?: string
          event_category?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          lead_id?: string | null
          profile_id?: string | null
          referrer?: string | null
          session_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          created_at?: string
          event_category?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          lead_id?: string | null
          profile_id?: string | null
          referrer?: string | null
          session_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "funnel_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      anotaciones: {
        Row: {
          categoria: string
          color: string | null
          created_at: string | null
          created_by: string | null
          etapa: number | null
          forma_data: Json | null
          forma_tipo: string | null
          id: string
          panoramica_id: string | null
          pieza_dental: number | null
          posicion_x: number
          posicion_y: number
          texto_paciente: string | null
          texto_profesional: string | null
          tipo: Database["public"]["Enums"]["tipo_anotacion"]
        }
        Insert: {
          categoria: string
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          etapa?: number | null
          forma_data?: Json | null
          forma_tipo?: string | null
          id?: string
          panoramica_id?: string | null
          pieza_dental?: number | null
          posicion_x: number
          posicion_y: number
          texto_paciente?: string | null
          texto_profesional?: string | null
          tipo: Database["public"]["Enums"]["tipo_anotacion"]
        }
        Update: {
          categoria?: string
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          etapa?: number | null
          forma_data?: Json | null
          forma_tipo?: string | null
          id?: string
          panoramica_id?: string | null
          pieza_dental?: number | null
          posicion_x?: number
          posicion_y?: number
          texto_paciente?: string | null
          texto_profesional?: string | null
          tipo?: Database["public"]["Enums"]["tipo_anotacion"]
        }
        Relationships: [
          {
            foreignKeyName: "anotaciones_panoramica_id_fkey"
            columns: ["panoramica_id"]
            isOneToOne: false
            referencedRelation: "panoramicas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anotaciones_panoramica_id_fkey"
            columns: ["panoramica_id"]
            isOneToOne: false
            referencedRelation: "v_evaluaciones_completas"
            referencedColumns: ["panoramica_id"]
          },
        ]
      }
      appointment_types: {
        Row: {
          buffer_after_minutes: number
          buffer_before_minutes: number
          code: string
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          is_active: boolean
          max_days_advance: number
          max_per_day: number | null
          min_hours_advance: number
          name: string
          price_clp: number | null
          requires_professional_ids: string[] | null
          updated_at: string
        }
        Insert: {
          buffer_after_minutes?: number
          buffer_before_minutes?: number
          code: string
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean
          max_days_advance?: number
          max_per_day?: number | null
          min_hours_advance?: number
          name: string
          price_clp?: number | null
          requires_professional_ids?: string[] | null
          updated_at?: string
        }
        Update: {
          buffer_after_minutes?: number
          buffer_before_minutes?: number
          code?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean
          max_days_advance?: number
          max_per_day?: number | null
          min_hours_advance?: number
          name?: string
          price_clp?: number | null
          requires_professional_ids?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          consultorio: string | null
          created_at: string | null
          dentalink_cita_id: number | null
          doctor: string | null
          estado: string | null
          fecha: string
          hora: string | null
          id: string
          notas: string | null
          paciente_rut: string | null
          tratamiento: string | null
        }
        Insert: {
          consultorio?: string | null
          created_at?: string | null
          dentalink_cita_id?: number | null
          doctor?: string | null
          estado?: string | null
          fecha: string
          hora?: string | null
          id?: string
          notas?: string | null
          paciente_rut?: string | null
          tratamiento?: string | null
        }
        Update: {
          consultorio?: string | null
          created_at?: string | null
          dentalink_cita_id?: number | null
          doctor?: string | null
          estado?: string | null
          fecha?: string
          hora?: string | null
          id?: string
          notas?: string | null
          paciente_rut?: string | null
          tratamiento?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_paciente_rut_fkey"
            columns: ["paciente_rut"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["rut"]
          },
        ]
      }
      armonia_beauty_scores: {
        Row: {
          id: string
          max_score: number | null
          mean_score: number
          min_score: number | null
          num_raters: number | null
          score_range: number | null
          std_score: number | null
          subject_id: string | null
        }
        Insert: {
          id?: string
          max_score?: number | null
          mean_score: number
          min_score?: number | null
          num_raters?: number | null
          score_range?: number | null
          std_score?: number | null
          subject_id?: string | null
        }
        Update: {
          id?: string
          max_score?: number | null
          mean_score?: number
          min_score?: number | null
          num_raters?: number | null
          score_range?: number | null
          std_score?: number | null
          subject_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "armonia_beauty_scores_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: true
            referencedRelation: "armonia_complete_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "armonia_beauty_scores_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: true
            referencedRelation: "armonia_subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      armonia_correlations: {
        Row: {
          context_filter: Json | null
          correlation_r: number
          created_at: string | null
          id: string
          is_significant: boolean | null
          metric_name: string
          sample_size: number | null
        }
        Insert: {
          context_filter?: Json | null
          correlation_r: number
          created_at?: string | null
          id?: string
          is_significant?: boolean | null
          metric_name: string
          sample_size?: number | null
        }
        Update: {
          context_filter?: Json | null
          correlation_r?: number
          created_at?: string | null
          id?: string
          is_significant?: boolean | null
          metric_name?: string
          sample_size?: number | null
        }
        Relationships: []
      }
      armonia_proportions: {
        Row: {
          face_ratio: number | null
          id: string
          interocular_ratio: number | null
          middle_to_lower: number | null
          mouth_ratio: number | null
          nose_ratio: number | null
          phi_approximation: number | null
          subject_id: string | null
          symmetry_score: number | null
        }
        Insert: {
          face_ratio?: number | null
          id?: string
          interocular_ratio?: number | null
          middle_to_lower?: number | null
          mouth_ratio?: number | null
          nose_ratio?: number | null
          phi_approximation?: number | null
          subject_id?: string | null
          symmetry_score?: number | null
        }
        Update: {
          face_ratio?: number | null
          id?: string
          interocular_ratio?: number | null
          middle_to_lower?: number | null
          mouth_ratio?: number | null
          nose_ratio?: number | null
          phi_approximation?: number | null
          subject_id?: string | null
          symmetry_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "armonia_proportions_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: true
            referencedRelation: "armonia_complete_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "armonia_proportions_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: true
            referencedRelation: "armonia_subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      armonia_subjects: {
        Row: {
          created_at: string | null
          dataset_category: string | null
          dataset_source: string | null
          ethnicity: string | null
          filename: string
          gender: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          dataset_category?: string | null
          dataset_source?: string | null
          ethnicity?: string | null
          filename: string
          gender?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          dataset_category?: string | null
          dataset_source?: string | null
          ethnicity?: string | null
          filename?: string
          gender?: string | null
          id?: string
        }
        Relationships: []
      }
      camera_events: {
        Row: {
          created_at: string | null
          engine: string
          feedback_key: string | null
          id: string
          metrics: Json | null
          patient_id: string | null
          quality_score: number | null
          session_id: string
          storage_path: string
          use_case: string
        }
        Insert: {
          created_at?: string | null
          engine: string
          feedback_key?: string | null
          id?: string
          metrics?: Json | null
          patient_id?: string | null
          quality_score?: number | null
          session_id: string
          storage_path: string
          use_case: string
        }
        Update: {
          created_at?: string | null
          engine?: string
          feedback_key?: string | null
          id?: string
          metrics?: Json | null
          patient_id?: string | null
          quality_score?: number | null
          session_id?: string
          storage_path?: string
          use_case?: string
        }
        Relationships: []
      }
      casos_4p: {
        Row: {
          auth_user_id: string | null
          canal_entrada: Database["public"]["Enums"]["canal_entrada"]
          created_at: string | null
          dentalink_cita_id: string | null
          dentalink_patient_id: string | null
          dentista_asignado: string | null
          dentista_nombre: string | null
          email: string | null
          estado: Database["public"]["Enums"]["estado_caso"]
          etapa: string | null
          fecha_cita: string | null
          hora_cita: string | null
          id: string
          magic_token: string | null
          magic_token_expires_at: string | null
          motivo: string
          nombre: string
          rut: string | null
          telefono: string
          updated_at: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          auth_user_id?: string | null
          canal_entrada?: Database["public"]["Enums"]["canal_entrada"]
          created_at?: string | null
          dentalink_cita_id?: string | null
          dentalink_patient_id?: string | null
          dentista_asignado?: string | null
          dentista_nombre?: string | null
          email?: string | null
          estado?: Database["public"]["Enums"]["estado_caso"]
          etapa?: string | null
          fecha_cita?: string | null
          hora_cita?: string | null
          id?: string
          magic_token?: string | null
          magic_token_expires_at?: string | null
          motivo: string
          nombre: string
          rut?: string | null
          telefono: string
          updated_at?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          auth_user_id?: string | null
          canal_entrada?: Database["public"]["Enums"]["canal_entrada"]
          created_at?: string | null
          dentalink_cita_id?: string | null
          dentalink_patient_id?: string | null
          dentista_asignado?: string | null
          dentista_nombre?: string | null
          email?: string | null
          estado?: Database["public"]["Enums"]["estado_caso"]
          etapa?: string | null
          fecha_cita?: string | null
          hora_cita?: string | null
          id?: string
          magic_token?: string | null
          magic_token_expires_at?: string | null
          motivo?: string
          nombre?: string
          rut?: string | null
          telefono?: string
          updated_at?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "casos_4p_dentista_asignado_fkey"
            columns: ["dentista_asignado"]
            isOneToOne: false
            referencedRelation: "equipo_clinico"
            referencedColumns: ["id"]
          },
        ]
      }
      catalogo_diagnosticos: {
        Row: {
          activo: boolean | null
          color: string | null
          icono: string | null
          id: string
          nombre: string
          orden: number | null
          texto_paciente_default: string
        }
        Insert: {
          activo?: boolean | null
          color?: string | null
          icono?: string | null
          id: string
          nombre: string
          orden?: number | null
          texto_paciente_default: string
        }
        Update: {
          activo?: boolean | null
          color?: string | null
          icono?: string | null
          id?: string
          nombre?: string
          orden?: number | null
          texto_paciente_default?: string
        }
        Relationships: []
      }
      catalogo_tratamientos: {
        Row: {
          activo: boolean | null
          color: string | null
          icono: string | null
          id: string
          nombre: string
          orden: number | null
          texto_paciente_default: string
        }
        Insert: {
          activo?: boolean | null
          color?: string | null
          icono?: string | null
          id: string
          nombre: string
          orden?: number | null
          texto_paciente_default: string
        }
        Update: {
          activo?: boolean | null
          color?: string | null
          icono?: string | null
          id?: string
          nombre?: string
          orden?: number | null
          texto_paciente_default?: string
        }
        Relationships: []
      }
      clarity_documents: {
        Row: {
          created_at: string
          doc_data: Json
          id: string
          lead_id: string
          plan_id: string | null
          viewed_at: string | null
          viewed_by_patient: boolean | null
        }
        Insert: {
          created_at?: string
          doc_data: Json
          id?: string
          lead_id: string
          plan_id?: string | null
          viewed_at?: string | null
          viewed_by_patient?: boolean | null
        }
        Update: {
          created_at?: string
          doc_data?: Json
          id?: string
          lead_id?: string
          plan_id?: string | null
          viewed_at?: string | null
          viewed_by_patient?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "clarity_documents_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "funnel_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clarity_documents_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "treatment_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      clinic_appointments: {
        Row: {
          amount_clp: number
          appointment_date: string
          appointment_time: string
          cancellation_policy_accepted: boolean
          cancellation_reason: string | null
          cancelled_at: string | null
          created_at: string
          dentalink_appointment_id: number | null
          dentalink_patient_id: number | null
          id: string
          mercadopago_payment_id: string | null
          mercadopago_preference_id: string | null
          patient_email: string
          patient_name: string
          patient_phone: string
          patient_rut: string | null
          payment_id: string | null
          professional_id: number
          professional_name: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_clp?: number
          appointment_date: string
          appointment_time: string
          cancellation_policy_accepted?: boolean
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          dentalink_appointment_id?: number | null
          dentalink_patient_id?: number | null
          id?: string
          mercadopago_payment_id?: string | null
          mercadopago_preference_id?: string | null
          patient_email: string
          patient_name: string
          patient_phone: string
          patient_rut?: string | null
          payment_id?: string | null
          professional_id: number
          professional_name: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_clp?: number
          appointment_date?: string
          appointment_time?: string
          cancellation_policy_accepted?: boolean
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          dentalink_appointment_id?: number | null
          dentalink_patient_id?: number | null
          id?: string
          mercadopago_payment_id?: string | null
          mercadopago_preference_id?: string | null
          patient_email?: string
          patient_name?: string
          patient_phone?: string
          patient_rut?: string | null
          payment_id?: string | null
          professional_id?: number
          professional_name?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinic_appointments_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      clinic_users: {
        Row: {
          email: string
          id: string
          role: string
        }
        Insert: {
          email: string
          id?: string
          role?: string
        }
        Update: {
          email?: string
          id?: string
          role?: string
        }
        Relationships: []
      }
      comprension_4p: {
        Row: {
          caso_id: string
          conoce_alternativas: boolean | null
          created_at: string | null
          cuantas_alternativas: number | null
          id: string
          llamada_at: string | null
          llamada_notas: string | null
          llamada_por: string | null
          llamada_realizada: boolean | null
          requiere_llamada: boolean | null
          respuesta_diagnostico: string | null
          sabe_consecuencia: boolean | null
          sabe_diagnostico: boolean | null
          score: number | null
          tiene_dudas: string | null
        }
        Insert: {
          caso_id: string
          conoce_alternativas?: boolean | null
          created_at?: string | null
          cuantas_alternativas?: number | null
          id?: string
          llamada_at?: string | null
          llamada_notas?: string | null
          llamada_por?: string | null
          llamada_realizada?: boolean | null
          requiere_llamada?: boolean | null
          respuesta_diagnostico?: string | null
          sabe_consecuencia?: boolean | null
          sabe_diagnostico?: boolean | null
          score?: number | null
          tiene_dudas?: string | null
        }
        Update: {
          caso_id?: string
          conoce_alternativas?: boolean | null
          created_at?: string | null
          cuantas_alternativas?: number | null
          id?: string
          llamada_at?: string | null
          llamada_notas?: string | null
          llamada_por?: string | null
          llamada_realizada?: boolean | null
          requiere_llamada?: boolean | null
          respuesta_diagnostico?: string | null
          sabe_consecuencia?: boolean | null
          sabe_diagnostico?: boolean | null
          score?: number | null
          tiene_dudas?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comprension_4p_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos_4p"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comprension_4p_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "v_llamadas_pendientes"
            referencedColumns: ["caso_id"]
          },
          {
            foreignKeyName: "comprension_4p_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "v_pipeline_4p"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comprension_4p_llamada_por_fkey"
            columns: ["llamada_por"]
            isOneToOne: false
            referencedRelation: "equipo_clinico"
            referencedColumns: ["id"]
          },
        ]
      }
      consents: {
        Row: {
          accepted: boolean
          accepted_at: string | null
          consent_text: string | null
          consent_type: string
          created_at: string
          id: string
          ip_address: string | null
          lead_id: string | null
          profile_id: string | null
          signature_data: string | null
          user_agent: string | null
          version: string
        }
        Insert: {
          accepted: boolean
          accepted_at?: string | null
          consent_text?: string | null
          consent_type: string
          created_at?: string
          id?: string
          ip_address?: string | null
          lead_id?: string | null
          profile_id?: string | null
          signature_data?: string | null
          user_agent?: string | null
          version?: string
        }
        Update: {
          accepted?: boolean
          accepted_at?: string | null
          consent_text?: string | null
          consent_type?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          lead_id?: string | null
          profile_id?: string | null
          signature_data?: string | null
          user_agent?: string | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "consents_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "funnel_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consents_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      consultations: {
        Row: {
          calendar_event_id: string | null
          cancelled_at: string | null
          completed_at: string | null
          created_at: string | null
          doctor_notes: string | null
          id: string
          meeting_link: string | null
          patient_id: string
          payment_order_id: string | null
          scheduled_at: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          calendar_event_id?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          doctor_notes?: string | null
          id?: string
          meeting_link?: string | null
          patient_id: string
          payment_order_id?: string | null
          scheduled_at?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          calendar_event_id?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          doctor_notes?: string | null
          id?: string
          meeting_link?: string | null
          patient_id?: string
          payment_order_id?: string | null
          scheduled_at?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultations_payment_order_id_fkey"
            columns: ["payment_order_id"]
            isOneToOne: false
            referencedRelation: "payment_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          metadata: Json | null
          name: string | null
          phone: string | null
          resend_id: string | null
          source: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          metadata?: Json | null
          name?: string | null
          phone?: string | null
          resend_id?: string | null
          source?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          metadata?: Json | null
          name?: string | null
          phone?: string | null
          resend_id?: string | null
          source?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cuestionarios_4p: {
        Row: {
          antecedentes_medicos: Json | null
          caso_id: string
          completado: boolean | null
          created_at: string | null
          expectativas: string | null
          habitos: Json | null
          historia_dental: Json | null
          id: string
          paso_abandono: number | null
          paso_actual: number | null
          radiografia_tipo: string | null
          radiografia_url: string | null
          tiempo_total_seg: number | null
          updated_at: string | null
        }
        Insert: {
          antecedentes_medicos?: Json | null
          caso_id: string
          completado?: boolean | null
          created_at?: string | null
          expectativas?: string | null
          habitos?: Json | null
          historia_dental?: Json | null
          id?: string
          paso_abandono?: number | null
          paso_actual?: number | null
          radiografia_tipo?: string | null
          radiografia_url?: string | null
          tiempo_total_seg?: number | null
          updated_at?: string | null
        }
        Update: {
          antecedentes_medicos?: Json | null
          caso_id?: string
          completado?: boolean | null
          created_at?: string | null
          expectativas?: string | null
          habitos?: Json | null
          historia_dental?: Json | null
          id?: string
          paso_abandono?: number | null
          paso_actual?: number | null
          radiografia_tipo?: string | null
          radiografia_url?: string | null
          tiempo_total_seg?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cuestionarios_4p_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos_4p"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cuestionarios_4p_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "v_llamadas_pendientes"
            referencedColumns: ["caso_id"]
          },
          {
            foreignKeyName: "cuestionarios_4p_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "v_pipeline_4p"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnosticos_4p: {
        Row: {
          alternativas: Json | null
          caso_id: string
          clasificacion_caso: string | null
          complejidad: string | null
          concordancia_ia: Json | null
          created_at: string | null
          dentista_id: string
          factores_riesgo: Json | null
          id: string
          indice_periodontal: Json | null
          notas_internas: string | null
          piezas_comprometidas: Json | null
          plan_preventivo: string | null
          radiografias: Json | null
          updated_at: string | null
          volumen_oseo: Json | null
        }
        Insert: {
          alternativas?: Json | null
          caso_id: string
          clasificacion_caso?: string | null
          complejidad?: string | null
          concordancia_ia?: Json | null
          created_at?: string | null
          dentista_id: string
          factores_riesgo?: Json | null
          id?: string
          indice_periodontal?: Json | null
          notas_internas?: string | null
          piezas_comprometidas?: Json | null
          plan_preventivo?: string | null
          radiografias?: Json | null
          updated_at?: string | null
          volumen_oseo?: Json | null
        }
        Update: {
          alternativas?: Json | null
          caso_id?: string
          clasificacion_caso?: string | null
          complejidad?: string | null
          concordancia_ia?: Json | null
          created_at?: string | null
          dentista_id?: string
          factores_riesgo?: Json | null
          id?: string
          indice_periodontal?: Json | null
          notas_internas?: string | null
          piezas_comprometidas?: Json | null
          plan_preventivo?: string | null
          radiografias?: Json | null
          updated_at?: string | null
          volumen_oseo?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "diagnosticos_4p_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos_4p"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnosticos_4p_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "v_llamadas_pendientes"
            referencedColumns: ["caso_id"]
          },
          {
            foreignKeyName: "diagnosticos_4p_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "v_pipeline_4p"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnosticos_4p_dentista_id_fkey"
            columns: ["dentista_id"]
            isOneToOne: false
            referencedRelation: "equipo_clinico"
            referencedColumns: ["id"]
          },
        ]
      }
      email_log: {
        Row: {
          clicked_at: string | null
          created_at: string | null
          email_type: string
          error_message: string | null
          id: string
          opened_at: string | null
          patient_id: string | null
          payment_order_id: string | null
          provider: string | null
          provider_message_id: string | null
          recipient_email: string
          sent_at: string | null
          status: string
          subject: string | null
        }
        Insert: {
          clicked_at?: string | null
          created_at?: string | null
          email_type: string
          error_message?: string | null
          id?: string
          opened_at?: string | null
          patient_id?: string | null
          payment_order_id?: string | null
          provider?: string | null
          provider_message_id?: string | null
          recipient_email: string
          sent_at?: string | null
          status?: string
          subject?: string | null
        }
        Update: {
          clicked_at?: string | null
          created_at?: string | null
          email_type?: string
          error_message?: string | null
          id?: string
          opened_at?: string | null
          patient_id?: string | null
          payment_order_id?: string | null
          provider?: string | null
          provider_message_id?: string | null
          recipient_email?: string
          sent_at?: string | null
          status?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_log_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_log_payment_order_id_fkey"
            columns: ["payment_order_id"]
            isOneToOne: false
            referencedRelation: "payment_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      equipo_clinico: {
        Row: {
          activo: boolean | null
          auth_user_id: string | null
          created_at: string | null
          email: string
          especialidad: string | null
          id: string
          nombre: string
          rol: Database["public"]["Enums"]["rol_equipo"]
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          auth_user_id?: string | null
          created_at?: string | null
          email: string
          especialidad?: string | null
          id?: string
          nombre: string
          rol?: Database["public"]["Enums"]["rol_equipo"]
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          auth_user_id?: string | null
          created_at?: string | null
          email?: string
          especialidad?: string | null
          id?: string
          nombre?: string
          rol?: Database["public"]["Enums"]["rol_equipo"]
          updated_at?: string | null
        }
        Relationships: []
      }
      evaluacion_historial: {
        Row: {
          created_at: string | null
          created_by: string | null
          estado_anterior: string | null
          estado_nuevo: string
          evaluacion_id: string | null
          id: string
          motivo: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          estado_anterior?: string | null
          estado_nuevo: string
          evaluacion_id?: string | null
          id?: string
          motivo?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          estado_anterior?: string | null
          estado_nuevo?: string
          evaluacion_id?: string | null
          id?: string
          motivo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evaluacion_historial_evaluacion_id_fkey"
            columns: ["evaluacion_id"]
            isOneToOne: false
            referencedRelation: "evaluaciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluacion_historial_evaluacion_id_fkey"
            columns: ["evaluacion_id"]
            isOneToOne: false
            referencedRelation: "v_evaluaciones_completas"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluaciones: {
        Row: {
          alergias: string | null
          cita_confirmada: boolean | null
          cita_fecha: string | null
          codigo: string
          created_at: string | null
          cuestionario_respuestas: Json | null
          dentalink_cita_id: string | null
          dentalink_paciente_id: string | null
          email: string
          enfermedades: string | null
          estado: string | null
          fecha_nacimiento: string | null
          ia_confidence: number | null
          ia_findings: Json | null
          ia_resumen: string | null
          ia_ruta_sugerida: string | null
          id: string
          medicamentos: string | null
          motivo_consulta: string | null
          nombre: string
          pago_cuotas: number | null
          pago_estado: string | null
          pago_fecha: string | null
          pago_id: string | null
          pago_monto: number | null
          rut: string | null
          selfie_reposo_url: string | null
          selfie_sonriendo_url: string | null
          source: string | null
          telefono: string | null
          terminos_aceptados: boolean | null
          terminos_fecha: string | null
          tipo: string
          tipo_imagen: string | null
          tipo_ruta: string | null
          updated_at: string | null
          utm_campaign: string | null
        }
        Insert: {
          alergias?: string | null
          cita_confirmada?: boolean | null
          cita_fecha?: string | null
          codigo: string
          created_at?: string | null
          cuestionario_respuestas?: Json | null
          dentalink_cita_id?: string | null
          dentalink_paciente_id?: string | null
          email: string
          enfermedades?: string | null
          estado?: string | null
          fecha_nacimiento?: string | null
          ia_confidence?: number | null
          ia_findings?: Json | null
          ia_resumen?: string | null
          ia_ruta_sugerida?: string | null
          id?: string
          medicamentos?: string | null
          motivo_consulta?: string | null
          nombre: string
          pago_cuotas?: number | null
          pago_estado?: string | null
          pago_fecha?: string | null
          pago_id?: string | null
          pago_monto?: number | null
          rut?: string | null
          selfie_reposo_url?: string | null
          selfie_sonriendo_url?: string | null
          source?: string | null
          telefono?: string | null
          terminos_aceptados?: boolean | null
          terminos_fecha?: string | null
          tipo: string
          tipo_imagen?: string | null
          tipo_ruta?: string | null
          updated_at?: string | null
          utm_campaign?: string | null
        }
        Update: {
          alergias?: string | null
          cita_confirmada?: boolean | null
          cita_fecha?: string | null
          codigo?: string
          created_at?: string | null
          cuestionario_respuestas?: Json | null
          dentalink_cita_id?: string | null
          dentalink_paciente_id?: string | null
          email?: string
          enfermedades?: string | null
          estado?: string | null
          fecha_nacimiento?: string | null
          ia_confidence?: number | null
          ia_findings?: Json | null
          ia_resumen?: string | null
          ia_ruta_sugerida?: string | null
          id?: string
          medicamentos?: string | null
          motivo_consulta?: string | null
          nombre?: string
          pago_cuotas?: number | null
          pago_estado?: string | null
          pago_fecha?: string | null
          pago_id?: string | null
          pago_monto?: number | null
          rut?: string | null
          selfie_reposo_url?: string | null
          selfie_sonriendo_url?: string | null
          source?: string | null
          telefono?: string | null
          terminos_aceptados?: boolean | null
          terminos_fecha?: string | null
          tipo?: string
          tipo_imagen?: string | null
          tipo_ruta?: string | null
          updated_at?: string | null
          utm_campaign?: string | null
        }
        Relationships: []
      }
      eventos_4p: {
        Row: {
          actor_id: string | null
          actor_tipo: string | null
          caso_id: string
          created_at: string | null
          detalle: Json | null
          evento: string
          id: string
        }
        Insert: {
          actor_id?: string | null
          actor_tipo?: string | null
          caso_id: string
          created_at?: string | null
          detalle?: Json | null
          evento: string
          id?: string
        }
        Update: {
          actor_id?: string | null
          actor_tipo?: string | null
          caso_id?: string
          created_at?: string | null
          detalle?: Json | null
          evento?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "eventos_4p_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos_4p"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_4p_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "v_llamadas_pendientes"
            referencedColumns: ["caso_id"]
          },
          {
            foreignKeyName: "eventos_4p_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "v_pipeline_4p"
            referencedColumns: ["id"]
          },
        ]
      }
      funnel_events: {
        Row: {
          created_at: string | null
          email: string | null
          event: string
          id: number
          metadata: Json | null
          motivo: string | null
          nombre: string | null
          order_id: string | null
          session_id: string | null
          zona: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          event: string
          id?: number
          metadata?: Json | null
          motivo?: string | null
          nombre?: string | null
          order_id?: string | null
          session_id?: string | null
          zona?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          event?: string
          id?: number
          metadata?: Json | null
          motivo?: string | null
          nombre?: string | null
          order_id?: string | null
          session_id?: string | null
          zona?: string | null
        }
        Relationships: []
      }
      funnel_history: {
        Row: {
          created_at: string
          ia_scan_result: Json | null
          id: string
          lead_id: string
          notes: string | null
          status: string
        }
        Insert: {
          created_at?: string
          ia_scan_result?: Json | null
          id?: string
          lead_id: string
          notes?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          ia_scan_result?: Json | null
          id?: string
          lead_id?: string
          notes?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "funnel_history_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "funnel_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      funnel_leads: {
        Row: {
          created_at: string
          dentalink_appointment_id: string | null
          dentalink_patient_id: string | null
          email: string
          ia_scan_completed_at: string | null
          ia_scan_result: Json | null
          id: string
          name: string
          origin: string | null
          phone: string
          reason: string | null
          rut: string | null
          scheduled_at: string | null
          scheduling_preferences: Json | null
          status: Database["public"]["Enums"]["funnel_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          dentalink_appointment_id?: string | null
          dentalink_patient_id?: string | null
          email: string
          ia_scan_completed_at?: string | null
          ia_scan_result?: Json | null
          id?: string
          name: string
          origin?: string | null
          phone: string
          reason?: string | null
          rut?: string | null
          scheduled_at?: string | null
          scheduling_preferences?: Json | null
          status?: Database["public"]["Enums"]["funnel_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          dentalink_appointment_id?: string | null
          dentalink_patient_id?: string | null
          email?: string
          ia_scan_completed_at?: string | null
          ia_scan_result?: Json | null
          id?: string
          name?: string
          origin?: string | null
          phone?: string
          reason?: string | null
          rut?: string | null
          scheduled_at?: string | null
          scheduling_preferences?: Json | null
          status?: Database["public"]["Enums"]["funnel_status"]
          updated_at?: string
        }
        Relationships: []
      }
      funnel_payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          description: string
          id: string
          lead_id: string
          mercadopago_payment_id: string | null
          mercadopago_preference_id: string | null
          mercadopago_response: Json | null
          mercadopago_status: string | null
          paid_at: string | null
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          description?: string
          id?: string
          lead_id: string
          mercadopago_payment_id?: string | null
          mercadopago_preference_id?: string | null
          mercadopago_response?: Json | null
          mercadopago_status?: string | null
          paid_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          description?: string
          id?: string
          lead_id?: string
          mercadopago_payment_id?: string | null
          mercadopago_preference_id?: string | null
          mercadopago_response?: Json | null
          mercadopago_status?: string | null
          paid_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "funnel_payments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "funnel_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      funnel_status_history: {
        Row: {
          changed_at: string
          from_status: Database["public"]["Enums"]["funnel_status"] | null
          id: string
          lead_id: string
          metadata: Json | null
          to_status: Database["public"]["Enums"]["funnel_status"]
        }
        Insert: {
          changed_at?: string
          from_status?: Database["public"]["Enums"]["funnel_status"] | null
          id?: string
          lead_id: string
          metadata?: Json | null
          to_status: Database["public"]["Enums"]["funnel_status"]
        }
        Update: {
          changed_at?: string
          from_status?: Database["public"]["Enums"]["funnel_status"] | null
          id?: string
          lead_id?: string
          metadata?: Json | null
          to_status?: Database["public"]["Enums"]["funnel_status"]
        }
        Relationships: [
          {
            foreignKeyName: "funnel_status_history_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "funnel_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      funnel_uploads: {
        Row: {
          created_at: string
          file_name: string
          file_size: number | null
          file_type: string
          id: string
          lead_id: string
          metadata: Json | null
          mime_type: string | null
          storage_path: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size?: number | null
          file_type: string
          id?: string
          lead_id: string
          metadata?: Json | null
          mime_type?: string | null
          storage_path: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_type?: string
          id?: string
          lead_id?: string
          metadata?: Json | null
          mime_type?: string | null
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "funnel_uploads_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "funnel_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      import_events: {
        Row: {
          created_at: string | null
          details: Json | null
          id: string
          imported: number
          source: string
          total: number
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          id?: string
          imported?: number
          source: string
          total?: number
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          id?: string
          imported?: number
          source?: string
          total?: number
        }
        Relationships: []
      }
      informes_4p: {
        Row: {
          abierto: boolean | null
          caso_id: string
          compartido: boolean | null
          contenido_html: string
          created_at: string | null
          descargo_pdf: boolean | null
          diagnostico_id: string
          enviado_at: string | null
          enviado_whatsapp: boolean | null
          id: string
          link_portal: string
          pdf_url: string | null
          primera_apertura_at: string | null
          tiempo_lectura_seg: number | null
          total_aperturas: number | null
          version: number
        }
        Insert: {
          abierto?: boolean | null
          caso_id: string
          compartido?: boolean | null
          contenido_html: string
          created_at?: string | null
          descargo_pdf?: boolean | null
          diagnostico_id: string
          enviado_at?: string | null
          enviado_whatsapp?: boolean | null
          id?: string
          link_portal: string
          pdf_url?: string | null
          primera_apertura_at?: string | null
          tiempo_lectura_seg?: number | null
          total_aperturas?: number | null
          version?: number
        }
        Update: {
          abierto?: boolean | null
          caso_id?: string
          compartido?: boolean | null
          contenido_html?: string
          created_at?: string | null
          descargo_pdf?: boolean | null
          diagnostico_id?: string
          enviado_at?: string | null
          enviado_whatsapp?: boolean | null
          id?: string
          link_portal?: string
          pdf_url?: string | null
          primera_apertura_at?: string | null
          tiempo_lectura_seg?: number | null
          total_aperturas?: number | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "informes_4p_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos_4p"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "informes_4p_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "v_llamadas_pendientes"
            referencedColumns: ["caso_id"]
          },
          {
            foreignKeyName: "informes_4p_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "v_pipeline_4p"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "informes_4p_diagnostico_id_fkey"
            columns: ["diagnostico_id"]
            isOneToOne: false
            referencedRelation: "diagnosticos_4p"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          age: number | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          risk_score: number | null
          session_id: string | null
          source: string | null
          status: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
        }
        Insert: {
          age?: number | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          risk_score?: number | null
          session_id?: string | null
          source?: string | null
          status?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
        }
        Update: {
          age?: number | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          risk_score?: number | null
          session_id?: string | null
          source?: string | null
          status?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
        }
        Relationships: []
      }
      leads_segunda_opinion: {
        Row: {
          archivos: Json | null
          created_at: string | null
          email: string | null
          estado: string | null
          id: number
          imagenes: Json | null
          mensaje: string | null
          nombre: string
          respondido_at: string | null
          respondido_por: string | null
          respuesta: string | null
          source: string | null
          telefono: string
          utm_campaign: string | null
        }
        Insert: {
          archivos?: Json | null
          created_at?: string | null
          email?: string | null
          estado?: string | null
          id?: number
          imagenes?: Json | null
          mensaje?: string | null
          nombre: string
          respondido_at?: string | null
          respondido_por?: string | null
          respuesta?: string | null
          source?: string | null
          telefono: string
          utm_campaign?: string | null
        }
        Update: {
          archivos?: Json | null
          created_at?: string | null
          email?: string | null
          estado?: string | null
          id?: number
          imagenes?: Json | null
          mensaje?: string | null
          nombre?: string
          respondido_at?: string | null
          respondido_por?: string | null
          respuesta?: string | null
          source?: string | null
          telefono?: string
          utm_campaign?: string | null
        }
        Relationships: []
      }
      links_compartidos: {
        Row: {
          created_at: string | null
          evaluacion_id: string | null
          expira_en: string | null
          id: string
          panoramica_id: string | null
          password_hash: string | null
          primera_vista: string | null
          token: string
          ultima_vista: string | null
          vistas: number | null
        }
        Insert: {
          created_at?: string | null
          evaluacion_id?: string | null
          expira_en?: string | null
          id?: string
          panoramica_id?: string | null
          password_hash?: string | null
          primera_vista?: string | null
          token: string
          ultima_vista?: string | null
          vistas?: number | null
        }
        Update: {
          created_at?: string | null
          evaluacion_id?: string | null
          expira_en?: string | null
          id?: string
          panoramica_id?: string | null
          password_hash?: string | null
          primera_vista?: string | null
          token?: string
          ultima_vista?: string | null
          vistas?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "links_compartidos_evaluacion_id_fkey"
            columns: ["evaluacion_id"]
            isOneToOne: false
            referencedRelation: "evaluaciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_compartidos_evaluacion_id_fkey"
            columns: ["evaluacion_id"]
            isOneToOne: false
            referencedRelation: "v_evaluaciones_completas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_compartidos_panoramica_id_fkey"
            columns: ["panoramica_id"]
            isOneToOne: false
            referencedRelation: "panoramicas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_compartidos_panoramica_id_fkey"
            columns: ["panoramica_id"]
            isOneToOne: false
            referencedRelation: "v_evaluaciones_completas"
            referencedColumns: ["panoramica_id"]
          },
        ]
      }
      lista_espera: {
        Row: {
          cita_id: number | null
          created_at: string | null
          email: string | null
          estado: string | null
          id: number
          nombre: string
          notificado_at: string | null
          preferencia_horario: string | null
          preferencia_profesional_id: number | null
          prioridad: number | null
          slot_ofrecido: Json | null
          telefono: string
          tratamiento_requerido: string | null
          updated_at: string | null
        }
        Insert: {
          cita_id?: number | null
          created_at?: string | null
          email?: string | null
          estado?: string | null
          id?: number
          nombre: string
          notificado_at?: string | null
          preferencia_horario?: string | null
          preferencia_profesional_id?: number | null
          prioridad?: number | null
          slot_ofrecido?: Json | null
          telefono: string
          tratamiento_requerido?: string | null
          updated_at?: string | null
        }
        Update: {
          cita_id?: number | null
          created_at?: string | null
          email?: string | null
          estado?: string | null
          id?: number
          nombre?: string
          notificado_at?: string | null
          preferencia_horario?: string | null
          preferencia_profesional_id?: number | null
          prioridad?: number | null
          slot_ofrecido?: Json | null
          telefono?: string
          tratamiento_requerido?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      notificaciones: {
        Row: {
          contenido: Json | null
          created_at: string | null
          email: string | null
          error: string | null
          estado: string | null
          id: number
          paciente_id: number | null
          telefono: string | null
          template: string | null
          tipo: string
          whatsapp_message_id: string | null
        }
        Insert: {
          contenido?: Json | null
          created_at?: string | null
          email?: string | null
          error?: string | null
          estado?: string | null
          id?: number
          paciente_id?: number | null
          telefono?: string | null
          template?: string | null
          tipo: string
          whatsapp_message_id?: string | null
        }
        Update: {
          contenido?: Json | null
          created_at?: string | null
          email?: string | null
          error?: string | null
          estado?: string | null
          id?: number
          paciente_id?: number | null
          telefono?: string | null
          template?: string | null
          tipo?: string
          whatsapp_message_id?: string | null
        }
        Relationships: []
      }
      notifications_log: {
        Row: {
          channel: string
          created_at: string
          delivered_at: string | null
          error_message: string | null
          external_message_id: string | null
          id: string
          lead_id: string | null
          message_content: string | null
          profile_id: string | null
          recipient_email: string | null
          recipient_phone: string | null
          sent_at: string | null
          status: string
          template_name: string | null
        }
        Insert: {
          channel: string
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          external_message_id?: string | null
          id?: string
          lead_id?: string | null
          message_content?: string | null
          profile_id?: string | null
          recipient_email?: string | null
          recipient_phone?: string | null
          sent_at?: string | null
          status?: string
          template_name?: string | null
        }
        Update: {
          channel?: string
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          external_message_id?: string | null
          id?: string
          lead_id?: string | null
          message_content?: string | null
          profile_id?: string | null
          recipient_email?: string | null
          recipient_phone?: string | null
          sent_at?: string | null
          status?: string
          template_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_log_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "funnel_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_log_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pacientes: {
        Row: {
          apellido: string | null
          contacto_emergencia_nombre: string | null
          contacto_emergencia_telefono: string | null
          created_at: string | null
          dentalink_id: number | null
          direccion: string | null
          email: string | null
          fecha_nacimiento: string | null
          id: string
          nombre: string | null
          rut: string
          telefono: string | null
          updated_at: string | null
        }
        Insert: {
          apellido?: string | null
          contacto_emergencia_nombre?: string | null
          contacto_emergencia_telefono?: string | null
          created_at?: string | null
          dentalink_id?: number | null
          direccion?: string | null
          email?: string | null
          fecha_nacimiento?: string | null
          id?: string
          nombre?: string | null
          rut: string
          telefono?: string | null
          updated_at?: string | null
        }
        Update: {
          apellido?: string | null
          contacto_emergencia_nombre?: string | null
          contacto_emergencia_telefono?: string | null
          created_at?: string | null
          dentalink_id?: number | null
          direccion?: string | null
          email?: string | null
          fecha_nacimiento?: string | null
          id?: string
          nombre?: string | null
          rut?: string
          telefono?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      pagos_4p: {
        Row: {
          caso_id: string | null
          created_at: string | null
          estado: string | null
          id: string
          metadata: Json | null
          metodo: string | null
          moneda: string | null
          monto: number
          referencia_externa: string | null
          referencia_mp: string | null
          updated_at: string | null
        }
        Insert: {
          caso_id?: string | null
          created_at?: string | null
          estado?: string | null
          id?: string
          metadata?: Json | null
          metodo?: string | null
          moneda?: string | null
          monto?: number
          referencia_externa?: string | null
          referencia_mp?: string | null
          updated_at?: string | null
        }
        Update: {
          caso_id?: string | null
          created_at?: string | null
          estado?: string | null
          id?: string
          metadata?: Json | null
          metodo?: string | null
          moneda?: string | null
          monto?: number
          referencia_externa?: string | null
          referencia_mp?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pagos_4p_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos_4p"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagos_4p_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "v_llamadas_pendientes"
            referencedColumns: ["caso_id"]
          },
          {
            foreignKeyName: "pagos_4p_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "v_pipeline_4p"
            referencedColumns: ["id"]
          },
        ]
      }
      pagos_portal: {
        Row: {
          concepto: string | null
          created_at: string | null
          estado: string | null
          fecha: string | null
          id: string
          metodo: string | null
          monto: number
          paciente_rut: string | null
          referencia: string | null
        }
        Insert: {
          concepto?: string | null
          created_at?: string | null
          estado?: string | null
          fecha?: string | null
          id?: string
          metodo?: string | null
          monto: number
          paciente_rut?: string | null
          referencia?: string | null
        }
        Update: {
          concepto?: string | null
          created_at?: string | null
          estado?: string | null
          fecha?: string | null
          id?: string
          metodo?: string | null
          monto?: number
          paciente_rut?: string | null
          referencia?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pagos_portal_paciente_rut_fkey"
            columns: ["paciente_rut"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["rut"]
          },
        ]
      }
      panoramicas: {
        Row: {
          alto: number | null
          ancho: number | null
          created_at: string | null
          created_by: string | null
          evaluacion_id: string | null
          fecha_captura: string | null
          formato: string | null
          id: string
          imagen_original_url: string | null
          imagen_url: string
          tamano_bytes: number | null
        }
        Insert: {
          alto?: number | null
          ancho?: number | null
          created_at?: string | null
          created_by?: string | null
          evaluacion_id?: string | null
          fecha_captura?: string | null
          formato?: string | null
          id?: string
          imagen_original_url?: string | null
          imagen_url: string
          tamano_bytes?: number | null
        }
        Update: {
          alto?: number | null
          ancho?: number | null
          created_at?: string | null
          created_by?: string | null
          evaluacion_id?: string | null
          fecha_captura?: string | null
          formato?: string | null
          id?: string
          imagen_original_url?: string | null
          imagen_url?: string
          tamano_bytes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "panoramicas_evaluacion_id_fkey"
            columns: ["evaluacion_id"]
            isOneToOne: false
            referencedRelation: "evaluaciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "panoramicas_evaluacion_id_fkey"
            columns: ["evaluacion_id"]
            isOneToOne: false
            referencedRelation: "v_evaluaciones_completas"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_credentials: {
        Row: {
          created_at: string
          dentalink_patient_id: string | null
          id: string
          name: string | null
          password_hash: string
          rut: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dentalink_patient_id?: string | null
          id?: string
          name?: string | null
          password_hash: string
          rut: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dentalink_patient_id?: string | null
          id?: string
          name?: string | null
          password_hash?: string
          rut?: string
          updated_at?: string
        }
        Relationships: []
      }
      patient_documents: {
        Row: {
          created_at: string | null
          fecha: string | null
          firmado: boolean | null
          id: string
          nombre: string | null
          paciente_rut: string | null
          tipo: string
          url: string | null
        }
        Insert: {
          created_at?: string | null
          fecha?: string | null
          firmado?: boolean | null
          id?: string
          nombre?: string | null
          paciente_rut?: string | null
          tipo: string
          url?: string | null
        }
        Update: {
          created_at?: string | null
          fecha?: string | null
          firmado?: boolean | null
          id?: string
          nombre?: string | null
          paciente_rut?: string | null
          tipo?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_documents_paciente_rut_fkey"
            columns: ["paciente_rut"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["rut"]
          },
        ]
      }
      patient_scheduling_preferences: {
        Row: {
          avoid_dates: string[] | null
          created_at: string
          id: string
          lead_id: string | null
          notes: string | null
          preferred_days: string[] | null
          preferred_time_range: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          avoid_dates?: string[] | null
          created_at?: string
          id?: string
          lead_id?: string | null
          notes?: string | null
          preferred_days?: string[] | null
          preferred_time_range?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          avoid_dates?: string[] | null
          created_at?: string
          id?: string
          lead_id?: string | null
          notes?: string | null
          preferred_days?: string[] | null
          preferred_time_range?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_scheduling_preferences_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "funnel_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          age: number | null
          created_at: string | null
          email: string
          id: string
          name: string | null
          phone: string | null
          quiz_data: Json
          risk_level: string
          success_probability: number
          updated_at: string | null
        }
        Insert: {
          age?: number | null
          created_at?: string | null
          email: string
          id?: string
          name?: string | null
          phone?: string | null
          quiz_data: Json
          risk_level: string
          success_probability: number
          updated_at?: string | null
        }
        Update: {
          age?: number | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          phone?: string | null
          quiz_data?: Json
          risk_level?: string
          success_probability?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_orders: {
        Row: {
          amount: number
          commerce_order: string
          created_at: string | null
          currency: string | null
          description: string | null
          email: string | null
          flow_order: string | null
          flow_token: string | null
          id: string
          metadata: Json | null
          nombre: string | null
          paid_at: string | null
          patient_id: string | null
          pdf_generated: boolean | null
          pdf_url: string | null
          plan: string | null
          provider: string | null
          provider_order_id: string | null
          provider_response: Json | null
          provider_token: string | null
          rut: string | null
          source: string | null
          status: string
          telefono: string | null
          updated_at: string | null
          utm_campaign: string | null
        }
        Insert: {
          amount: number
          commerce_order: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          email?: string | null
          flow_order?: string | null
          flow_token?: string | null
          id?: string
          metadata?: Json | null
          nombre?: string | null
          paid_at?: string | null
          patient_id?: string | null
          pdf_generated?: boolean | null
          pdf_url?: string | null
          plan?: string | null
          provider?: string | null
          provider_order_id?: string | null
          provider_response?: Json | null
          provider_token?: string | null
          rut?: string | null
          source?: string | null
          status?: string
          telefono?: string | null
          updated_at?: string | null
          utm_campaign?: string | null
        }
        Update: {
          amount?: number
          commerce_order?: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          email?: string | null
          flow_order?: string | null
          flow_token?: string | null
          id?: string
          metadata?: Json | null
          nombre?: string | null
          paid_at?: string | null
          patient_id?: string | null
          pdf_generated?: boolean | null
          pdf_url?: string | null
          plan?: string | null
          provider?: string | null
          provider_order_id?: string | null
          provider_response?: Json | null
          provider_token?: string | null
          rut?: string | null
          source?: string | null
          status?: string
          telefono?: string | null
          updated_at?: string | null
          utm_campaign?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_orders_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          checkout_url: string | null
          created_at: string
          currency: string
          description: string | null
          id: string
          lead_id: string
          metadata: Json | null
          paid_at: string | null
          preference_id: string | null
          provider: string | null
          provider_payment_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount?: number
          checkout_url?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          lead_id: string
          metadata?: Json | null
          paid_at?: string | null
          preference_id?: string | null
          provider?: string | null
          provider_payment_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          checkout_url?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          lead_id?: string
          metadata?: Json | null
          paid_at?: string | null
          preference_id?: string | null
          provider?: string | null
          provider_payment_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "funnel_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      presupuestos_4p: {
        Row: {
          alternativa_elegida: string | null
          alternativas: Json
          caso_id: string
          created_at: string | null
          descuento_porcentaje: number | null
          diagnostico_id: string
          estado_pago: Database["public"]["Enums"]["estado_pago"] | null
          id: string
          metodo_pago: Database["public"]["Enums"]["metodo_pago"] | null
          notas_financieras: string | null
          pagos: Json | null
          updated_at: string | null
        }
        Insert: {
          alternativa_elegida?: string | null
          alternativas?: Json
          caso_id: string
          created_at?: string | null
          descuento_porcentaje?: number | null
          diagnostico_id: string
          estado_pago?: Database["public"]["Enums"]["estado_pago"] | null
          id?: string
          metodo_pago?: Database["public"]["Enums"]["metodo_pago"] | null
          notas_financieras?: string | null
          pagos?: Json | null
          updated_at?: string | null
        }
        Update: {
          alternativa_elegida?: string | null
          alternativas?: Json
          caso_id?: string
          created_at?: string | null
          descuento_porcentaje?: number | null
          diagnostico_id?: string
          estado_pago?: Database["public"]["Enums"]["estado_pago"] | null
          id?: string
          metodo_pago?: Database["public"]["Enums"]["metodo_pago"] | null
          notas_financieras?: string | null
          pagos?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "presupuestos_4p_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos_4p"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "presupuestos_4p_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "v_llamadas_pendientes"
            referencedColumns: ["caso_id"]
          },
          {
            foreignKeyName: "presupuestos_4p_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "v_pipeline_4p"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "presupuestos_4p_diagnostico_id_fkey"
            columns: ["diagnostico_id"]
            isOneToOne: false
            referencedRelation: "diagnosticos_4p"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          basic_credits: number
          city: string | null
          created_at: string
          date_of_birth: string | null
          dentalink_patient_id: string | null
          email: string
          email_verified: boolean | null
          full_name: string
          gender: string | null
          id: string
          is_active: boolean | null
          phone: string | null
          phone_verified: boolean | null
          premium_credits: number
          region: string | null
          rut: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          basic_credits?: number
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          dentalink_patient_id?: string | null
          email: string
          email_verified?: boolean | null
          full_name: string
          gender?: string | null
          id?: string
          is_active?: boolean | null
          phone?: string | null
          phone_verified?: boolean | null
          premium_credits?: number
          region?: string | null
          rut?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          basic_credits?: number
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          dentalink_patient_id?: string | null
          email?: string
          email_verified?: boolean | null
          full_name?: string
          gender?: string | null
          id?: string
          is_active?: boolean | null
          phone?: string | null
          phone_verified?: boolean | null
          premium_credits?: number
          region?: string | null
          rut?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      promo_code_redemptions: {
        Row: {
          analysis_id: string | null
          id: string
          promo_code_id: string
          redeemed_at: string
          user_id: string
        }
        Insert: {
          analysis_id?: string | null
          id?: string
          promo_code_id: string
          redeemed_at?: string
          user_id: string
        }
        Update: {
          analysis_id?: string | null
          id?: string
          promo_code_id?: string
          redeemed_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promo_code_redemptions_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "analyses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promo_code_redemptions_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_codes: {
        Row: {
          benefit_type: string
          code: string
          created_at: string
          created_by: string | null
          description: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          max_uses: number
          times_used: number
        }
        Insert: {
          benefit_type?: string
          code: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number
          times_used?: number
        }
        Update: {
          benefit_type?: string
          code?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number
          times_used?: number
        }
        Relationships: []
      }
      second_opinions: {
        Row: {
          budget_document_path: string | null
          converted_to_evaluation: boolean | null
          created_at: string
          current_diagnosis: string | null
          email: string
          external_budget_amount: number | null
          external_clinic_name: string | null
          flow_type: string
          has_rx: boolean | null
          ia_completed_at: string | null
          ia_report: Json | null
          id: string
          lead_id: string | null
          name: string
          payment_id: string | null
          payment_status: string | null
          phone: string
          profile_id: string | null
          reason: string
          rx_storage_paths: string[] | null
          specialist_id: string | null
          status: string
          updated_at: string
          videocall_completed: boolean | null
          videocall_scheduled_at: string | null
          videocall_url: string | null
        }
        Insert: {
          budget_document_path?: string | null
          converted_to_evaluation?: boolean | null
          created_at?: string
          current_diagnosis?: string | null
          email: string
          external_budget_amount?: number | null
          external_clinic_name?: string | null
          flow_type?: string
          has_rx?: boolean | null
          ia_completed_at?: string | null
          ia_report?: Json | null
          id?: string
          lead_id?: string | null
          name: string
          payment_id?: string | null
          payment_status?: string | null
          phone: string
          profile_id?: string | null
          reason: string
          rx_storage_paths?: string[] | null
          specialist_id?: string | null
          status?: string
          updated_at?: string
          videocall_completed?: boolean | null
          videocall_scheduled_at?: string | null
          videocall_url?: string | null
        }
        Update: {
          budget_document_path?: string | null
          converted_to_evaluation?: boolean | null
          created_at?: string
          current_diagnosis?: string | null
          email?: string
          external_budget_amount?: number | null
          external_clinic_name?: string | null
          flow_type?: string
          has_rx?: boolean | null
          ia_completed_at?: string | null
          ia_report?: Json | null
          id?: string
          lead_id?: string | null
          name?: string
          payment_id?: string | null
          payment_status?: string | null
          phone?: string
          profile_id?: string | null
          reason?: string
          rx_storage_paths?: string[] | null
          specialist_id?: string | null
          status?: string
          updated_at?: string
          videocall_completed?: boolean | null
          videocall_scheduled_at?: string | null
          videocall_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "second_opinions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "funnel_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "second_opinions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      seguimientos_4p: {
        Row: {
          caso_id: string
          complicacion: boolean | null
          complicacion_detalle: string | null
          created_at: string | null
          dolor_nivel: number | null
          id: string
          notas: string | null
          realizado_por: string | null
          satisfaccion: number | null
          tipo: string
        }
        Insert: {
          caso_id: string
          complicacion?: boolean | null
          complicacion_detalle?: string | null
          created_at?: string | null
          dolor_nivel?: number | null
          id?: string
          notas?: string | null
          realizado_por?: string | null
          satisfaccion?: number | null
          tipo: string
        }
        Update: {
          caso_id?: string
          complicacion?: boolean | null
          complicacion_detalle?: string | null
          created_at?: string | null
          dolor_nivel?: number | null
          id?: string
          notas?: string | null
          realizado_por?: string | null
          satisfaccion?: number | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "seguimientos_4p_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos_4p"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seguimientos_4p_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "v_llamadas_pendientes"
            referencedColumns: ["caso_id"]
          },
          {
            foreignKeyName: "seguimientos_4p_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "v_pipeline_4p"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seguimientos_4p_realizado_por_fkey"
            columns: ["realizado_por"]
            isOneToOne: false
            referencedRelation: "equipo_clinico"
            referencedColumns: ["id"]
          },
        ]
      }
      sentia_evaluaciones: {
        Row: {
          ansiedad_espera: number
          ansiedad_extraccion: number
          ansiedad_general: number
          ansiedad_inyeccion: number
          ansiedad_taladro: number
          caso_id: string
          categoria: Database["public"]["Enums"]["categoria_ansiedad"] | null
          comentario_paciente: string | null
          created_at: string | null
          id: string
          protocolo_generado: Json | null
          score_total: number | null
          tipo: Database["public"]["Enums"]["tipo_sentia"]
        }
        Insert: {
          ansiedad_espera: number
          ansiedad_extraccion: number
          ansiedad_general: number
          ansiedad_inyeccion: number
          ansiedad_taladro: number
          caso_id: string
          categoria?: Database["public"]["Enums"]["categoria_ansiedad"] | null
          comentario_paciente?: string | null
          created_at?: string | null
          id?: string
          protocolo_generado?: Json | null
          score_total?: number | null
          tipo?: Database["public"]["Enums"]["tipo_sentia"]
        }
        Update: {
          ansiedad_espera?: number
          ansiedad_extraccion?: number
          ansiedad_general?: number
          ansiedad_inyeccion?: number
          ansiedad_taladro?: number
          caso_id?: string
          categoria?: Database["public"]["Enums"]["categoria_ansiedad"] | null
          comentario_paciente?: string | null
          created_at?: string | null
          id?: string
          protocolo_generado?: Json | null
          score_total?: number | null
          tipo?: Database["public"]["Enums"]["tipo_sentia"]
        }
        Relationships: [
          {
            foreignKeyName: "sentia_evaluaciones_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "casos_4p"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sentia_evaluaciones_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "v_llamadas_pendientes"
            referencedColumns: ["caso_id"]
          },
          {
            foreignKeyName: "sentia_evaluaciones_caso_id_fkey"
            columns: ["caso_id"]
            isOneToOne: false
            referencedRelation: "v_pipeline_4p"
            referencedColumns: ["id"]
          },
        ]
      }
      simulation_sessions: {
        Row: {
          created_at: string | null
          id: string
          lead_id: string | null
          raw_photo_url: string | null
          result_json: Json | null
          risk_score: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lead_id?: string | null
          raw_photo_url?: string | null
          result_json?: Json | null
          risk_score?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lead_id?: string | null
          raw_photo_url?: string | null
          result_json?: Json | null
          risk_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "simulation_sessions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      slots_disponibles: {
        Row: {
          created_at: string | null
          dentalink_cita_id: number | null
          estado: string | null
          fecha: string
          hora_fin: string | null
          hora_inicio: string
          id: number
          origen: string | null
          profesional_id: number | null
          profesional_nombre: string | null
          sucursal_id: number | null
        }
        Insert: {
          created_at?: string | null
          dentalink_cita_id?: number | null
          estado?: string | null
          fecha: string
          hora_fin?: string | null
          hora_inicio: string
          id?: number
          origen?: string | null
          profesional_id?: number | null
          profesional_nombre?: string | null
          sucursal_id?: number | null
        }
        Update: {
          created_at?: string | null
          dentalink_cita_id?: number | null
          estado?: string | null
          fecha?: string
          hora_fin?: string | null
          hora_inicio?: string
          id?: number
          origen?: string | null
          profesional_id?: number | null
          profesional_nombre?: string | null
          sucursal_id?: number | null
        }
        Relationships: []
      }
      social_leads: {
        Row: {
          actualizado_en: string | null
          atendido_por: string | null
          canal_origen: string | null
          creado_en: string | null
          derivar_whatsapp: boolean | null
          especialidad: string | null
          estado: string | null
          id: string
          mensaje_enviado: string | null
          mensaje_original: string | null
          nombre: string | null
          notas_recepcion: string | null
          sender_ig_id: string | null
          sintoma: string | null
          tag_manychat: string | null
          urgencia: string | null
          url_evaluacion: string | null
        }
        Insert: {
          actualizado_en?: string | null
          atendido_por?: string | null
          canal_origen?: string | null
          creado_en?: string | null
          derivar_whatsapp?: boolean | null
          especialidad?: string | null
          estado?: string | null
          id?: string
          mensaje_enviado?: string | null
          mensaje_original?: string | null
          nombre?: string | null
          notas_recepcion?: string | null
          sender_ig_id?: string | null
          sintoma?: string | null
          tag_manychat?: string | null
          urgencia?: string | null
          url_evaluacion?: string | null
        }
        Update: {
          actualizado_en?: string | null
          atendido_por?: string | null
          canal_origen?: string | null
          creado_en?: string | null
          derivar_whatsapp?: boolean | null
          especialidad?: string | null
          estado?: string | null
          id?: string
          mensaje_enviado?: string | null
          mensaje_original?: string | null
          nombre?: string | null
          notas_recepcion?: string | null
          sender_ig_id?: string | null
          sintoma?: string | null
          tag_manychat?: string | null
          urgencia?: string | null
          url_evaluacion?: string | null
        }
        Relationships: []
      }
      treatment_plans: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          id: string
          lead_id: string
          plan_data: Json
          status: string
          updated_at: string
          version: number
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          lead_id: string
          plan_data: Json
          status?: string
          updated_at?: string
          version?: number
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          lead_id?: string
          plan_data?: Json
          status?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "treatment_plans_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "funnel_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      treatments: {
        Row: {
          created_at: string | null
          doctor: string | null
          estado: string | null
          fecha_estimada_fin: string | null
          fecha_inicio: string | null
          id: string
          nombre: string
          notas: string | null
          paciente_rut: string | null
          progreso: number | null
        }
        Insert: {
          created_at?: string | null
          doctor?: string | null
          estado?: string | null
          fecha_estimada_fin?: string | null
          fecha_inicio?: string | null
          id?: string
          nombre: string
          notas?: string | null
          paciente_rut?: string | null
          progreso?: number | null
        }
        Update: {
          created_at?: string | null
          doctor?: string | null
          estado?: string | null
          fecha_estimada_fin?: string | null
          fecha_inicio?: string | null
          id?: string
          nombre?: string
          notas?: string | null
          paciente_rut?: string | null
          progreso?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "treatments_paciente_rut_fkey"
            columns: ["paciente_rut"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["rut"]
          },
        ]
      }
      user_coupons: {
        Row: {
          coupon_code: string
          coupon_type: string
          created_at: string
          discount_percent: number
          expires_at: string | null
          id: string
          original_value: number
          redeemed_at: string | null
          user_id: string
        }
        Insert: {
          coupon_code: string
          coupon_type?: string
          created_at?: string
          discount_percent?: number
          expires_at?: string | null
          id?: string
          original_value?: number
          redeemed_at?: string | null
          user_id: string
        }
        Update: {
          coupon_code?: string
          coupon_type?: string
          created_at?: string
          discount_percent?: number
          expires_at?: string | null
          id?: string
          original_value?: number
          redeemed_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          appointment_type_id: string | null
          created_at: string
          expires_at: string | null
          id: string
          lead_id: string | null
          max_wait_days: number | null
          offered_at: string | null
          preferred_dates: string[]
          preferred_time_range: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          appointment_type_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          lead_id?: string | null
          max_wait_days?: number | null
          offered_at?: string | null
          preferred_dates: string[]
          preferred_time_range?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          appointment_type_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          lead_id?: string | null
          max_wait_days?: number | null
          offered_at?: string | null
          preferred_dates?: string[]
          preferred_time_range?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "waitlist_appointment_type_id_fkey"
            columns: ["appointment_type_id"]
            isOneToOne: false
            referencedRelation: "appointment_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waitlist_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "funnel_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_logs: {
        Row: {
          created_at: string | null
          error: string | null
          event_type: string
          id: number
          payload: Json
          processed: boolean | null
          processed_at: string | null
          source: string
        }
        Insert: {
          created_at?: string | null
          error?: string | null
          event_type: string
          id?: number
          payload: Json
          processed?: boolean | null
          processed_at?: string | null
          source: string
        }
        Update: {
          created_at?: string | null
          error?: string | null
          event_type?: string
          id?: number
          payload?: Json
          processed?: boolean | null
          processed_at?: string | null
          source?: string
        }
        Relationships: []
      }
    }
    Views: {
      armonia_complete_view: {
        Row: {
          dataset_category: string | null
          ethnicity: string | null
          face_ratio: number | null
          filename: string | null
          gender: string | null
          id: string | null
          mean_score: number | null
          phi_approximation: number | null
          score_range: number | null
          std_score: number | null
          symmetry_score: number | null
        }
        Relationships: []
      }
      conversion_stats: {
        Row: {
          base_count: number | null
          date: string | null
          free_count: number | null
          paid_orders: number | null
          pending_orders: number | null
          premium_count: number | null
          revenue: number | null
        }
        Relationships: []
      }
      daily_revenue: {
        Row: {
          base_orders: number | null
          base_revenue: number | null
          date: string | null
          orders: number | null
          premium_orders: number | null
          premium_revenue: number | null
          revenue: number | null
        }
        Relationships: []
      }
      risk_distribution: {
        Row: {
          avg_success_rate: number | null
          count: number | null
          percentage: number | null
          risk_level: string | null
        }
        Relationships: []
      }
      social_leads_dashboard: {
        Row: {
          canal_origen: string | null
          creado_en: string | null
          derivar_whatsapp: boolean | null
          especialidad: string | null
          estado: string | null
          id: string | null
          mensaje_enviado: string | null
          mensaje_resumen: string | null
          nombre: string | null
          notas_recepcion: string | null
          sintoma: string | null
          urgencia: string | null
        }
        Insert: {
          canal_origen?: string | null
          creado_en?: string | null
          derivar_whatsapp?: boolean | null
          especialidad?: string | null
          estado?: string | null
          id?: string | null
          mensaje_enviado?: string | null
          mensaje_resumen?: never
          nombre?: string | null
          notas_recepcion?: string | null
          sintoma?: string | null
          urgencia?: string | null
        }
        Update: {
          canal_origen?: string | null
          creado_en?: string | null
          derivar_whatsapp?: boolean | null
          especialidad?: string | null
          estado?: string | null
          id?: string | null
          mensaje_enviado?: string | null
          mensaje_resumen?: never
          nombre?: string | null
          notas_recepcion?: string | null
          sintoma?: string | null
          urgencia?: string | null
        }
        Relationships: []
      }
      v_ab_testing: {
        Row: {
          contactados: number | null
          pagados: number | null
          source: string | null
          total_leads: number | null
        }
        Relationships: []
      }
      v_evaluaciones_completas: {
        Row: {
          alergias: string | null
          cita_confirmada: boolean | null
          cita_fecha: string | null
          codigo: string | null
          created_at: string | null
          dentalink_cita_id: string | null
          dentalink_paciente_id: string | null
          email: string | null
          enfermedades: string | null
          estado: string | null
          fecha_nacimiento: string | null
          id: string | null
          link_token: string | null
          link_vistas: number | null
          medicamentos: string | null
          nombre: string | null
          pago_cuotas: number | null
          pago_estado: string | null
          pago_fecha: string | null
          pago_id: string | null
          pago_monto: number | null
          panoramica_id: string | null
          panoramica_url: string | null
          rut: string | null
          selfie_reposo_url: string | null
          selfie_sonriendo_url: string | null
          telefono: string | null
          terminos_aceptados: boolean | null
          terminos_fecha: string | null
          tipo: string | null
          total_diagnosticos: number | null
          total_tratamientos: number | null
          updated_at: string | null
        }
        Relationships: []
      }
      v_llamadas_pendientes: {
        Row: {
          caso_id: string | null
          nivel_ansiedad:
            | Database["public"]["Enums"]["categoria_ansiedad"]
            | null
          nombre: string | null
          score: number | null
          score_ansiedad: number | null
          telefono: string | null
          test_completado_at: string | null
          tiene_dudas: string | null
        }
        Relationships: []
      }
      v_metricas_funnel: {
        Row: {
          aceptaron: number | null
          cancelados: number | null
          completados: number | null
          comprension_ok: number | null
          diagnosticados: number | null
          en_nuevo: number | null
          en_tratamiento: number | null
          esperando_cuestionario: number | null
          esperando_evaluacion: number | null
          esperando_sentia: number | null
          informe_enviado: number | null
          pct_aceptan_tratamiento: number | null
          pct_pasan_sentia: number | null
          total_casos: number | null
        }
        Relationships: []
      }
      v_pipeline_4p: {
        Row: {
          canal_entrada: Database["public"]["Enums"]["canal_entrada"] | null
          created_at: string | null
          cuestionario_completo: boolean | null
          dentista_nombre: string | null
          estado: Database["public"]["Enums"]["estado_caso"] | null
          id: string | null
          informe_leido: boolean | null
          nivel_ansiedad:
            | Database["public"]["Enums"]["categoria_ansiedad"]
            | null
          nombre: string | null
          score_ansiedad: number | null
          telefono: string | null
          tiene_diagnostico: boolean | null
          tiene_informe: boolean | null
        }
        Relationships: []
      }
    }
    Functions: {
      generate_eval_code: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_credits: {
        Args: { p_basic?: number; p_premium?: number; p_user_id: string }
        Returns: undefined
      }
      increment_link_views: { Args: { link_token: string }; Returns: undefined }
      is_admin: { Args: never; Returns: boolean }
      is_staff: { Args: never; Returns: boolean }
      owns_caso: { Args: { p_caso_id: string }; Returns: boolean }
    }
    Enums: {
      analysis_mode: "freemium" | "premium"
      app_role: "admin" | "moderator" | "user"
      canal_entrada:
        | "web"
        | "whatsapp"
        | "referido"
        | "instagram"
        | "telefono"
        | "presencial"
      categoria_ansiedad: "baja" | "moderada" | "alta" | "severa"
      estado_caso:
        | "nuevo"
        | "sentia_pendiente"
        | "cuestionario_pendiente"
        | "evaluacion_pendiente"
        | "diagnostico_listo"
        | "informe_enviado"
        | "comprension_verificada"
        | "decision_pendiente"
        | "aceptado"
        | "en_tratamiento"
        | "seguimiento"
        | "completado"
        | "cancelado"
      estado_pago: "pendiente" | "parcial" | "completo" | "reembolsado"
      funnel_status:
        | "LEAD"
        | "IA_DONE"
        | "CHECKOUT_CREATED"
        | "PAID"
        | "SCHEDULED"
      metodo_pago:
        | "mercado_pago"
        | "flow"
        | "transferencia"
        | "efectivo"
        | "etapas"
      payment_status:
        | "pending"
        | "approved"
        | "rejected"
        | "cancelled"
        | "refunded"
      rol_equipo: "dentista" | "admin" | "recepcion" | "higienista"
      status_3d: "pending" | "processing" | "completed" | "failed"
      tipo_anotacion: "diagnostico" | "tratamiento"
      tipo_sentia: "pre_tratamiento" | "post_tratamiento"
      user_plan: "free" | "premium" | "pro"
      user_type: "patient" | "pro"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      analysis_mode: ["freemium", "premium"],
      app_role: ["admin", "moderator", "user"],
      canal_entrada: [
        "web",
        "whatsapp",
        "referido",
        "instagram",
        "telefono",
        "presencial",
      ],
      categoria_ansiedad: ["baja", "moderada", "alta", "severa"],
      estado_caso: [
        "nuevo",
        "sentia_pendiente",
        "cuestionario_pendiente",
        "evaluacion_pendiente",
        "diagnostico_listo",
        "informe_enviado",
        "comprension_verificada",
        "decision_pendiente",
        "aceptado",
        "en_tratamiento",
        "seguimiento",
        "completado",
        "cancelado",
      ],
      estado_pago: ["pendiente", "parcial", "completo", "reembolsado"],
      funnel_status: [
        "LEAD",
        "IA_DONE",
        "CHECKOUT_CREATED",
        "PAID",
        "SCHEDULED",
      ],
      metodo_pago: [
        "mercado_pago",
        "flow",
        "transferencia",
        "efectivo",
        "etapas",
      ],
      payment_status: [
        "pending",
        "approved",
        "rejected",
        "cancelled",
        "refunded",
      ],
      rol_equipo: ["dentista", "admin", "recepcion", "higienista"],
      status_3d: ["pending", "processing", "completed", "failed"],
      tipo_anotacion: ["diagnostico", "tratamiento"],
      tipo_sentia: ["pre_tratamiento", "post_tratamiento"],
      user_plan: ["free", "premium", "pro"],
      user_type: ["patient", "pro"],
    },
  },
} as const
