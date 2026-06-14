export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      calendar_events: {
        Row: {
          calendar_id: string
          created_at: string | null
          date: string
          end_time: string
          id: string
          start_time: string
          title: string
          user_id: string
        }
        Insert: {
          calendar_id: string
          created_at?: string | null
          date: string
          end_time: string
          id?: string
          start_time: string
          title: string
          user_id: string
        }
        Update: {
          calendar_id?: string
          created_at?: string | null
          date?: string
          end_time?: string
          id?: string
          start_time?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_calendar_id_fkey"
            columns: ["calendar_id"]
            isOneToOne: false
            referencedRelation: "calendars"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_members: {
        Row: {
          calendar_id: string
          created_at: string | null
          id: string
          invited_by: string
          role: Database["public"]["Enums"]["calendar_role"]
          status: Database["public"]["Enums"]["invite_status"]
          user_id: string
        }
        Insert: {
          calendar_id: string
          created_at?: string | null
          id?: string
          invited_by: string
          role: Database["public"]["Enums"]["calendar_role"]
          status?: Database["public"]["Enums"]["invite_status"]
          user_id: string
        }
        Update: {
          calendar_id?: string
          created_at?: string | null
          id?: string
          invited_by?: string
          role?: Database["public"]["Enums"]["calendar_role"]
          status?: Database["public"]["Enums"]["invite_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_members_calendar_id_fkey"
            columns: ["calendar_id"]
            isOneToOne: false
            referencedRelation: "calendars"
            referencedColumns: ["id"]
          },
        ]
      }
      calendars: {
        Row: {
          color: string
          created_at: string | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          color?: string
          created_at?: string | null
          id?: string
          name: string
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      event_change_proposals: {
        Row: {
          created_at: string | null
          date: string | null
          end_time: string | null
          event_id: string
          id: string
          proposed_by: string
          start_time: string | null
          status: Database["public"]["Enums"]["invite_status"]
          title: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          end_time?: string | null
          event_id: string
          id?: string
          proposed_by: string
          start_time?: string | null
          status?: Database["public"]["Enums"]["invite_status"]
          title?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          end_time?: string | null
          event_id?: string
          id?: string
          proposed_by?: string
          start_time?: string | null
          status?: Database["public"]["Enums"]["invite_status"]
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_change_proposals_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "calendar_events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_instances: {
        Row: {
          calendar_id: string
          created_at: string | null
          display_name: string | null
          event_id: string
          id: string
          user_id: string
        }
        Insert: {
          calendar_id: string
          created_at?: string | null
          display_name?: string | null
          event_id: string
          id?: string
          user_id: string
        }
        Update: {
          calendar_id?: string
          created_at?: string | null
          display_name?: string | null
          event_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_instances_calendar_id_fkey"
            columns: ["calendar_id"]
            isOneToOne: false
            referencedRelation: "calendars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_instances_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "calendar_events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_shares: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          role: Database["public"]["Enums"]["calendar_role"]
          shared_by: string
          shared_with: string
          status: Database["public"]["Enums"]["invite_status"]
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          role: Database["public"]["Enums"]["calendar_role"]
          shared_by: string
          shared_with: string
          status?: Database["public"]["Enums"]["invite_status"]
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          role?: Database["public"]["Enums"]["calendar_role"]
          shared_by?: string
          shared_with?: string
          status?: Database["public"]["Enums"]["invite_status"]
        }
        Relationships: [
          {
            foreignKeyName: "event_shares_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "calendar_events"
            referencedColumns: ["id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string | null
          endpoint: string
          id: string
          p256dh: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string | null
          endpoint: string
          id?: string
          p256dh: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string | null
          endpoint?: string
          id?: string
          p256dh?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      stock_scans: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          scan_date: string
          status: string
          triggered_by: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          scan_date: string
          status?: string
          triggered_by?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          scan_date?: string
          status?: string
          triggered_by?: string
          user_id?: string
        }
        Relationships: []
      }
      stock_sets: {
        Row: {
          aggregate_pnl_pct: number | null
          bought_at: string | null
          created_at: string | null
          hit_target_at: string | null
          id: string
          notes: string | null
          scan_id: string
          sold_at: string | null
          status: Database["public"]["Enums"]["stock_set_status"]
          target_pct: number
          user_id: string
        }
        Insert: {
          aggregate_pnl_pct?: number | null
          bought_at?: string | null
          created_at?: string | null
          hit_target_at?: string | null
          id?: string
          notes?: string | null
          scan_id: string
          sold_at?: string | null
          status?: Database["public"]["Enums"]["stock_set_status"]
          target_pct?: number
          user_id: string
        }
        Update: {
          aggregate_pnl_pct?: number | null
          bought_at?: string | null
          created_at?: string | null
          hit_target_at?: string | null
          id?: string
          notes?: string | null
          scan_id?: string
          sold_at?: string | null
          status?: Database["public"]["Enums"]["stock_set_status"]
          target_pct?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_sets_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "stock_scans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permissions: {
        Row: {
          granted_at: string | null
          id: string
          permission: string
          user_id: string
        }
        Insert: {
          granted_at?: string | null
          id?: string
          permission: string
          user_id: string
        }
        Update: {
          granted_at?: string | null
          id?: string
          permission?: string
          user_id?: string
        }
        Relationships: []
      }
      households: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      household_members: {
        Row: {
          household_id: string
          joined_at: string | null
          user_id: string
        }
        Insert: {
          household_id: string
          joined_at?: string | null
          user_id: string
        }
        Update: {
          household_id?: string
          joined_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "household_members_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          created_at: string | null
          household_id: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          created_at?: string | null
          household_id: string
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          created_at?: string | null
          household_id?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          carbs_per_100g: number | null
          category_id: string | null
          created_at: string | null
          created_by: string | null
          fat_per_100g: number | null
          household_id: string
          id: string
          kcal_per_100g: number | null
          name: string
          notes: string | null
          protein_per_100g: number | null
          unit_conversions: Json
        }
        Insert: {
          carbs_per_100g?: number | null
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          fat_per_100g?: number | null
          household_id: string
          id?: string
          kcal_per_100g?: number | null
          name: string
          notes?: string | null
          protein_per_100g?: number | null
          unit_conversions?: Json
        }
        Update: {
          carbs_per_100g?: number | null
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          fat_per_100g?: number | null
          household_id?: string
          id?: string
          kcal_per_100g?: number | null
          name?: string
          notes?: string | null
          protein_per_100g?: number | null
          unit_conversions?: Json
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_categories: {
        Row: {
          created_at: string | null
          household_id: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          created_at?: string | null
          household_id: string
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          created_at?: string | null
          household_id?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "recipe_categories_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          category_id: string | null
          created_at: string | null
          created_by: string | null
          household_id: string
          id: string
          name: string
          notes: string | null
          servings: number
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          household_id: string
          id?: string
          name: string
          notes?: string | null
          servings?: number
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          household_id?: string
          id?: string
          name?: string
          notes?: string | null
          servings?: number
        }
        Relationships: [
          {
            foreignKeyName: "recipes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "recipe_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_ingredients: {
        Row: {
          id: string
          product_id: string
          quantity: number
          recipe_id: string
          sort_order: number
          unit: string
        }
        Insert: {
          id?: string
          product_id: string
          quantity: number
          recipe_id: string
          sort_order?: number
          unit: string
        }
        Update: {
          id?: string
          product_id?: string
          quantity?: number
          recipe_id?: string
          sort_order?: number
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_steps: {
        Row: {
          content: string
          id: string
          order_index: number
          recipe_id: string
        }
        Insert: {
          content: string
          id?: string
          order_index?: number
          recipe_id: string
        }
        Update: {
          content?: string
          id?: string
          order_index?: number
          recipe_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_steps_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_plans: {
        Row: {
          created_at: string | null
          date: string
          household_id: string
          id: string
          position: number
          recipe_id: string
          servings_multiplier: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          household_id: string
          id?: string
          position?: number
          recipe_id: string
          servings_multiplier?: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          household_id?: string
          id?: string
          position?: number
          recipe_id?: string
          servings_multiplier?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_plans_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_plans_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_checks: {
        Row: {
          checked_at: string | null
          household_id: string
          id: string
          product_id: string
          quantity_at_check: number
          scope: string
          unit: string
          user_id: string
        }
        Insert: {
          checked_at?: string | null
          household_id: string
          id?: string
          product_id: string
          quantity_at_check: number
          scope: string
          unit: string
          user_id: string
        }
        Update: {
          checked_at?: string | null
          household_id?: string
          id?: string
          product_id?: string
          quantity_at_check?: number
          scope?: string
          unit?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopping_checks_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_checks_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_set_items: {
        Row: {
          actual_entry_price: number | null
          actual_exit_price: number | null
          atr: number | null
          closed_at: string | null
          created_at: string | null
          exchange: string
          exit_reason: string | null
          gap_pct: number | null
          hit_1pct_at: string | null
          id: string
          max_pct_observed: number | null
          min_pct_observed: number | null
          opened_at: string | null
          quantity: number | null
          rank: number
          rationale: string | null
          set_id: string
          status: Database["public"]["Enums"]["stock_set_item_status"]
          suggested_entry_price: number
          suggested_stop_loss: number
          ticker: string
          user_id: string
          volume_ratio: number | null
          xtb_symbol: string
        }
        Insert: {
          actual_entry_price?: number | null
          actual_exit_price?: number | null
          atr?: number | null
          closed_at?: string | null
          created_at?: string | null
          exchange: string
          exit_reason?: string | null
          gap_pct?: number | null
          hit_1pct_at?: string | null
          id?: string
          max_pct_observed?: number | null
          min_pct_observed?: number | null
          opened_at?: string | null
          quantity?: number | null
          rank?: number
          rationale?: string | null
          set_id: string
          status?: Database["public"]["Enums"]["stock_set_item_status"]
          suggested_entry_price: number
          suggested_stop_loss: number
          ticker: string
          user_id: string
          volume_ratio?: number | null
          xtb_symbol: string
        }
        Update: {
          actual_entry_price?: number | null
          actual_exit_price?: number | null
          atr?: number | null
          closed_at?: string | null
          created_at?: string | null
          exchange?: string
          exit_reason?: string | null
          gap_pct?: number | null
          hit_1pct_at?: string | null
          id?: string
          max_pct_observed?: number | null
          min_pct_observed?: number | null
          opened_at?: string | null
          quantity?: number | null
          rank?: number
          rationale?: string | null
          set_id?: string
          status?: Database["public"]["Enums"]["stock_set_item_status"]
          suggested_entry_price?: number
          suggested_stop_loss?: number
          ticker?: string
          user_id?: string
          volume_ratio?: number | null
          xtb_symbol?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_set_items_set_id_fkey"
            columns: ["set_id"]
            isOneToOne: false
            referencedRelation: "stock_sets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      calendar_role: "author" | "admin" | "editor" | "creator" | "viewer"
      invite_status: "pending" | "accepted" | "declined"
      stock_set_status: "proposed" | "bought" | "sold" | "skipped"
      stock_set_item_status: "pending" | "open" | "stopped_out" | "closed_with_set"
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
      calendar_role: ["author", "admin", "editor", "creator", "viewer"],
      invite_status: ["pending", "accepted", "declined"],
      stock_set_status: ["proposed", "bought", "sold", "skipped"],
      stock_set_item_status: ["pending", "open", "stopped_out", "closed_with_set"],
    },
  },
} as const
