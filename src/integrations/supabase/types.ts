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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      group_deal_participants: {
        Row: {
          deal_id: string
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          deal_id: string
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          deal_id?: string
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_deal_participants_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "group_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      group_deals: {
        Row: {
          created_at: string
          created_by: string
          discount_percent: number
          expires_at: string
          id: string
          invite_code: string
          is_active: boolean | null
          product_id: string
          target_participants: number
        }
        Insert: {
          created_at?: string
          created_by: string
          discount_percent?: number
          expires_at: string
          id?: string
          invite_code: string
          is_active?: boolean | null
          product_id: string
          target_participants?: number
        }
        Update: {
          created_at?: string
          created_by?: string
          discount_percent?: number
          expires_at?: string
          id?: string
          invite_code?: string
          is_active?: boolean | null
          product_id?: string
          target_participants?: number
        }
        Relationships: [
          {
            foreignKeyName: "group_deals_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string
          id: string
          image_url: string | null
          mood: string | null
          name: string
          price: number
          specs: Json | null
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          image_url?: string | null
          mood?: string | null
          name: string
          price: number
          specs?: Json | null
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          image_url?: string | null
          mood?: string | null
          name?: string
          price?: number
          specs?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      session_cart_items: {
        Row: {
          added_by: string
          created_at: string
          id: string
          product_id: string
          quantity: number | null
          session_id: string
        }
        Insert: {
          added_by: string
          created_at?: string
          id?: string
          product_id: string
          quantity?: number | null
          session_id: string
        }
        Update: {
          added_by?: string
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_cart_items_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "shopping_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          session_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          session_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "shopping_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_participants: {
        Row: {
          display_name: string | null
          id: string
          joined_at: string
          session_id: string
          user_id: string
        }
        Insert: {
          display_name?: string | null
          id?: string
          joined_at?: string
          session_id: string
          user_id: string
        }
        Update: {
          display_name?: string | null
          id?: string
          joined_at?: string
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "shopping_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_votes: {
        Row: {
          created_at: string
          id: string
          product_id: string
          session_id: string
          user_id: string
          vote: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          session_id: string
          user_id: string
          vote: boolean
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          session_id?: string
          user_id?: string
          vote?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "session_votes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_votes_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "shopping_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_sessions: {
        Row: {
          created_at: string
          created_by: string
          id: string
          invite_code: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          invite_code: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          invite_code?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_session_participant: {
        Args: { _session_id: string; _user_id: string }
        Returns: boolean
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
    Enums: {},
  },
} as const
