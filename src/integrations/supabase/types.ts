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
      bank_details: {
        Row: {
          account_number: string
          bank_name: string
          created_at: string | null
          id: string
          ifsc_code: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_number: string
          bank_name: string
          created_at?: string | null
          id?: string
          ifsc_code: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_number?: string
          bank_name?: string
          created_at?: string | null
          id?: string
          ifsc_code?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_applications: {
        Row: {
          applied_amount: number
          applied_date: string | null
          applied_tenure: number
          approved_date: string | null
          completion_date: string | null
          created_at: string | null
          emi: number
          finance_comment: string | null
          id: string
          loan_id: string
          manager_comment: string | null
          rejected_date: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          applied_amount: number
          applied_date?: string | null
          applied_tenure: number
          approved_date?: string | null
          completion_date?: string | null
          created_at?: string | null
          emi: number
          finance_comment?: string | null
          id?: string
          loan_id: string
          manager_comment?: string | null
          rejected_date?: string | null
          status: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          applied_amount?: number
          applied_date?: string | null
          applied_tenure?: number
          approved_date?: string | null
          completion_date?: string | null
          created_at?: string | null
          emi?: number
          finance_comment?: string | null
          id?: string
          loan_id?: string
          manager_comment?: string | null
          rejected_date?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loan_applications_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "loans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loan_applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_repayments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          is_paid: boolean | null
          loan_application_id: string
          payment_date: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          is_paid?: boolean | null
          loan_application_id: string
          payment_date?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          is_paid?: boolean | null
          loan_application_id?: string
          payment_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loan_repayments_loan_application_id_fkey"
            columns: ["loan_application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_workflow_history: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          comment: string | null
          created_at: string | null
          id: string
          loan_application_id: string
          status_from: string | null
          status_to: string
          updated_at: string | null
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          loan_application_id: string
          status_from?: string | null
          status_to: string
          updated_at?: string | null
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          loan_application_id?: string
          status_from?: string | null
          status_to?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loan_workflow_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loan_workflow_history_loan_application_id_fkey"
            columns: ["loan_application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      loans: {
        Row: {
          created_at: string | null
          description: string | null
          eligibility_criteria: string | null
          id: string
          interest_rate: number
          is_active: boolean | null
          max_amount: number
          max_tenure_months: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          eligibility_criteria?: string | null
          id?: string
          interest_rate: number
          is_active?: boolean | null
          max_amount: number
          max_tenure_months: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          eligibility_criteria?: string | null
          id?: string
          interest_rate?: number
          is_active?: boolean | null
          max_amount?: number
          max_tenure_months?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          department: string
          email: string
          employee_id: string
          id: string
          name: string
          role: string
          salary: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department: string
          email: string
          employee_id: string
          id?: string
          name: string
          role: string
          salary?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string
          email?: string
          employee_id?: string
          id?: string
          name?: string
          role?: string
          salary?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
