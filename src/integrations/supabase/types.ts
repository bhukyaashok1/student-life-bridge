export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      attendance: {
        Row: {
          branch: string
          created_at: string
          date: string
          id: string
          is_present: boolean
          section: string
          semester: number
          student_id: string | null
          subject: string
          time_slot: string | null
          updated_at: string
          year: number
        }
        Insert: {
          branch: string
          created_at?: string
          date: string
          id?: string
          is_present?: boolean
          section: string
          semester: number
          student_id?: string | null
          subject: string
          time_slot?: string | null
          updated_at?: string
          year: number
        }
        Update: {
          branch?: string
          created_at?: string
          date?: string
          id?: string
          is_present?: boolean
          section?: string
          semester?: number
          student_id?: string | null
          subject?: string
          time_slot?: string | null
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      marks: {
        Row: {
          assignment: number | null
          branch: string
          created_at: string
          id: string
          mid1: number | null
          mid2: number | null
          section: string
          semester: number
          student_id: string | null
          subject: string
          total: number | null
          updated_at: string
          year: number
        }
        Insert: {
          assignment?: number | null
          branch: string
          created_at?: string
          id?: string
          mid1?: number | null
          mid2?: number | null
          section: string
          semester: number
          student_id?: string | null
          subject: string
          total?: number | null
          updated_at?: string
          year: number
        }
        Update: {
          assignment?: number | null
          branch?: string
          created_at?: string
          id?: string
          mid1?: number | null
          mid2?: number | null
          section?: string
          semester?: number
          student_id?: string | null
          subject?: string
          total?: number | null
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "marks_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
          user_id: string | null
          user_type: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string | null
          user_type: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string | null
          user_type?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          branch: string
          cgpa: number | null
          created_at: string
          id: string
          profile_id: string | null
          roll_number: string
          section: string
          semester: number
          sgpa: number | null
          updated_at: string
          year: number
        }
        Insert: {
          branch: string
          cgpa?: number | null
          created_at?: string
          id?: string
          profile_id?: string | null
          roll_number: string
          section: string
          semester: number
          sgpa?: number | null
          updated_at?: string
          year: number
        }
        Update: {
          branch?: string
          cgpa?: number | null
          created_at?: string
          id?: string
          profile_id?: string | null
          roll_number?: string
          section?: string
          semester?: number
          sgpa?: number | null
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "students_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          branch: string
          created_at: string
          id: string
          name: string
          semester: number
          year: number
        }
        Insert: {
          branch: string
          created_at?: string
          id?: string
          name: string
          semester: number
          year: number
        }
        Update: {
          branch?: string
          created_at?: string
          id?: string
          name?: string
          semester?: number
          year?: number
        }
        Relationships: []
      }
      timetables: {
        Row: {
          branch: string
          created_at: string
          day_of_week: string
          id: string
          section: string
          semester: number
          subject: string
          time_slot: string
          updated_at: string
          year: number
        }
        Insert: {
          branch: string
          created_at?: string
          day_of_week: string
          id?: string
          section: string
          semester: number
          subject: string
          time_slot: string
          updated_at?: string
          year: number
        }
        Update: {
          branch?: string
          created_at?: string
          day_of_week?: string
          id?: string
          section?: string
          semester?: number
          subject?: string
          time_slot?: string
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_attendance_records: {
        Args: {
          p_date: string
          p_subject: string
          p_branch: string
          p_year: number
          p_section: string
        }
        Returns: {
          student_id: string
          is_present: boolean
        }[]
      }
      get_student_marks: {
        Args: {
          p_branch: string
          p_year: number
          p_semester: number
          p_section: string
          p_subject?: string
        }
        Returns: {
          student_id: string
          student_name: string
          roll_number: string
          subject: string
          mid1: number
          mid2: number
          assignment: number
          total: number
        }[]
      }
      get_subjects_for_class: {
        Args: { p_branch: string; p_year: number; p_semester?: number }
        Returns: {
          name: string
        }[]
      }
      get_time_slots_for_year: {
        Args: { p_year: number }
        Returns: string[]
      }
      get_timetable_for_class: {
        Args: {
          p_branch: string
          p_year: number
          p_semester: number
          p_section: string
        }
        Returns: {
          id: string
          day_of_week: string
          time_slot: string
          subject: string
          branch: string
          year: number
          semester: number
          section: string
        }[]
      }
      save_attendance_records: {
        Args: { p_records: Json }
        Returns: undefined
      }
      save_student_marks: {
        Args: {
          p_student_id: string
          p_subject: string
          p_branch: string
          p_year: number
          p_semester: number
          p_section: string
          p_mid1: number
          p_mid2: number
          p_assignment: number
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
