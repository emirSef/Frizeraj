/**
 * Supabase database type definitions.
 *
 * Kept in sync with the migrations in `supabase/migrations`. After changing the
 * schema, regenerate from your Supabase project with:
 *   npx supabase gen types typescript --project-id <your-project-id> > src/types/database.types.ts
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = "admin" | "manager" | "stylist" | "receptionist";
export type ClientGender = "male" | "female" | "other" | "prefer_not_to_say";
export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          full_name: string;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "users_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      clients: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          phone: string | null;
          email: string | null;
          birth_date: string | null;
          gender: ClientGender | null;
          country: string | null;
          city: string | null;
          notes: string | null;
          avatar_url: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          phone?: string | null;
          email?: string | null;
          birth_date?: string | null;
          gender?: ClientGender | null;
          country?: string | null;
          city?: string | null;
          notes?: string | null;
          avatar_url?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          phone?: string | null;
          email?: string | null;
          birth_date?: string | null;
          gender?: ClientGender | null;
          country?: string | null;
          city?: string | null;
          notes?: string | null;
          avatar_url?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "clients_created_by_fkey";
            columns: ["created_by"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      services: {
        Row: {
          id: string;
          name: string;
          duration: number;
          default_price: number;
          color: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          duration?: number;
          default_price?: number;
          color?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          duration?: number;
          default_price?: number;
          color?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      service_records: {
        Row: {
          id: string;
          appointment_id: string;
          client_id: string;
          service_id: string | null;
          hair_condition: string | null;
          treatment: string | null;
          products_used: string | null;
          color_formula: string | null;
          notes: string | null;
          recommendations: string | null;
          before_image_url: string | null;
          after_image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          appointment_id: string;
          client_id: string;
          service_id?: string | null;
          hair_condition?: string | null;
          treatment?: string | null;
          products_used?: string | null;
          color_formula?: string | null;
          notes?: string | null;
          recommendations?: string | null;
          before_image_url?: string | null;
          after_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          appointment_id?: string;
          client_id?: string;
          service_id?: string | null;
          hair_condition?: string | null;
          treatment?: string | null;
          products_used?: string | null;
          color_formula?: string | null;
          notes?: string | null;
          recommendations?: string | null;
          before_image_url?: string | null;
          after_image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "service_records_appointment_id_fkey";
            columns: ["appointment_id"];
            referencedRelation: "appointments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "service_records_client_id_fkey";
            columns: ["client_id"];
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "service_records_service_id_fkey";
            columns: ["service_id"];
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      appointments: {
        Row: {
          id: string;
          client_id: string;
          service_id: string | null;
          date: string;
          start_time: string;
          end_time: string;
          treatment: string | null;
          products: string | null;
          notes: string | null;
          price: number | null;
          status: AppointmentStatus;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          service_id?: string | null;
          date: string;
          start_time: string;
          end_time: string;
          treatment?: string | null;
          products?: string | null;
          notes?: string | null;
          price?: number | null;
          status?: AppointmentStatus;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          service_id?: string | null;
          date?: string;
          start_time?: string;
          end_time?: string;
          treatment?: string | null;
          products?: string | null;
          notes?: string | null;
          price?: number | null;
          status?: AppointmentStatus;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "appointments_client_id_fkey";
            columns: ["client_id"];
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_service_id_fkey";
            columns: ["service_id"];
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_created_by_fkey";
            columns: ["created_by"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      current_user_role: {
        Args: Record<string, never>;
        Returns: UserRole;
      };
    };
    Enums: {
      user_role: UserRole;
      client_gender: ClientGender;
      appointment_status: AppointmentStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
