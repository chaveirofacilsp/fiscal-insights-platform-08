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
      assinaturas: {
        Row: {
          created_at: string
          data_fim: string | null
          data_inicio: string | null
          external_payment_id: string | null
          gateway: string | null
          id: string
          plano_id: string | null
          status: string
          updated_at: string
          user_id: string
          valor_pago: number | null
        }
        Insert: {
          created_at?: string
          data_fim?: string | null
          data_inicio?: string | null
          external_payment_id?: string | null
          gateway?: string | null
          id?: string
          plano_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
          valor_pago?: number | null
        }
        Update: {
          created_at?: string
          data_fim?: string | null
          data_inicio?: string | null
          external_payment_id?: string | null
          gateway?: string | null
          id?: string
          plano_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          valor_pago?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "assinaturas_plano_id_fkey"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "planos_assinatura"
            referencedColumns: ["id"]
          },
        ]
      }
      conteudos: {
        Row: {
          autor_id: string | null
          categoria: string
          comentario_tecnico: string | null
          created_at: string | null
          data_publicacao: string
          destaque: boolean | null
          dicas_alertas: string | null
          exemplo_pratico: string | null
          fonte_url: string | null
          id: string
          modelo_documento: string | null
          nivel_acesso: string
          numero_norma: string | null
          orgao_emissor: string | null
          resumo_executivo: string | null
          status: string
          tags: string[] | null
          texto_oficial: string | null
          tipo: string
          titulo: string
          updated_at: string | null
          visualizacoes: number | null
        }
        Insert: {
          autor_id?: string | null
          categoria: string
          comentario_tecnico?: string | null
          created_at?: string | null
          data_publicacao?: string
          destaque?: boolean | null
          dicas_alertas?: string | null
          exemplo_pratico?: string | null
          fonte_url?: string | null
          id?: string
          modelo_documento?: string | null
          nivel_acesso?: string
          numero_norma?: string | null
          orgao_emissor?: string | null
          resumo_executivo?: string | null
          status?: string
          tags?: string[] | null
          texto_oficial?: string | null
          tipo?: string
          titulo: string
          updated_at?: string | null
          visualizacoes?: number | null
        }
        Update: {
          autor_id?: string | null
          categoria?: string
          comentario_tecnico?: string | null
          created_at?: string | null
          data_publicacao?: string
          destaque?: boolean | null
          dicas_alertas?: string | null
          exemplo_pratico?: string | null
          fonte_url?: string | null
          id?: string
          modelo_documento?: string | null
          nivel_acesso?: string
          numero_norma?: string | null
          orgao_emissor?: string | null
          resumo_executivo?: string | null
          status?: string
          tags?: string[] | null
          texto_oficial?: string | null
          tipo?: string
          titulo?: string
          updated_at?: string | null
          visualizacoes?: number | null
        }
        Relationships: []
      }
      matriculas: {
        Row: {
          created_at: string | null
          dados_matricula: Json | null
          id: string
          nome_curso: string
          status: string | null
          tipo_curso: string
          user_id: string | null
          valor: number | null
        }
        Insert: {
          created_at?: string | null
          dados_matricula?: Json | null
          id?: string
          nome_curso: string
          status?: string | null
          tipo_curso: string
          user_id?: string | null
          valor?: number | null
        }
        Update: {
          created_at?: string | null
          dados_matricula?: Json | null
          id?: string
          nome_curso?: string
          status?: string | null
          tipo_curso?: string
          user_id?: string | null
          valor?: number | null
        }
        Relationships: []
      }
      payment_gateways: {
        Row: {
          additional_config: Json | null
          created_at: string
          display_name: string
          environment: string
          gateway_name: string
          id: string
          is_active: boolean
          public_key: string | null
          secret_key_encrypted: string | null
          updated_at: string
          webhook_secret: string | null
          webhook_url: string | null
        }
        Insert: {
          additional_config?: Json | null
          created_at?: string
          display_name: string
          environment?: string
          gateway_name: string
          id?: string
          is_active?: boolean
          public_key?: string | null
          secret_key_encrypted?: string | null
          updated_at?: string
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Update: {
          additional_config?: Json | null
          created_at?: string
          display_name?: string
          environment?: string
          gateway_name?: string
          id?: string
          is_active?: boolean
          public_key?: string | null
          secret_key_encrypted?: string | null
          updated_at?: string
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Relationships: []
      }
      payment_notifications: {
        Row: {
          created_at: string
          error_message: string | null
          event_type: string
          external_id: string | null
          gateway: string
          id: string
          payload: Json
          processed_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          event_type: string
          external_id?: string | null
          gateway: string
          id?: string
          payload?: Json
          processed_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          event_type?: string
          external_id?: string | null
          gateway?: string
          id?: string
          payload?: Json
          processed_at?: string | null
          status?: string
        }
        Relationships: []
      }
      planilhas_mensais: {
        Row: {
          ano: number
          arquivo_url: string
          created_at: string | null
          descricao: string | null
          id: string
          mes: number
        }
        Insert: {
          ano: number
          arquivo_url: string
          created_at?: string | null
          descricao?: string | null
          id?: string
          mes: number
        }
        Update: {
          ano?: number
          arquivo_url?: string
          created_at?: string | null
          descricao?: string | null
          id?: string
          mes?: number
        }
        Relationships: []
      }
      planos_assinatura: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          preco: number | null
          recursos: Json | null
          tipo: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          preco?: number | null
          recursos?: Json | null
          tipo: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          preco?: number | null
          recursos?: Json | null
          tipo?: string
        }
        Relationships: []
      }
      prazos_obrigacoes: {
        Row: {
          categoria: string
          created_at: string | null
          data_vencimento: string
          descricao: string | null
          id: string
          nivel_acesso: string
          orgao_responsavel: string | null
          recorrencia: string | null
          titulo: string
        }
        Insert: {
          categoria: string
          created_at?: string | null
          data_vencimento: string
          descricao?: string | null
          id?: string
          nivel_acesso?: string
          orgao_responsavel?: string | null
          recorrencia?: string | null
          titulo: string
        }
        Update: {
          categoria?: string
          created_at?: string | null
          data_vencimento?: string
          descricao?: string | null
          id?: string
          nivel_acesso?: string
          orgao_responsavel?: string | null
          recorrencia?: string | null
          titulo?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          documento: string | null
          email: string | null
          empresa: string | null
          habilitado: boolean | null
          id: string
          nome_completo: string | null
          plano: string | null
          status: string | null
          telefone: string | null
          tipo_pessoa: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          documento?: string | null
          email?: string | null
          empresa?: string | null
          habilitado?: boolean | null
          id: string
          nome_completo?: string | null
          plano?: string | null
          status?: string | null
          telefone?: string | null
          tipo_pessoa?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          documento?: string | null
          email?: string | null
          empresa?: string | null
          habilitado?: boolean | null
          id?: string
          nome_completo?: string | null
          plano?: string | null
          status?: string | null
          telefone?: string | null
          tipo_pessoa?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      solicitacoes_orcamento: {
        Row: {
          created_at: string | null
          descricao_necessidade: string
          email: string
          empresa: string | null
          id: string
          nome: string
          status: string | null
          telefone: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          descricao_necessidade: string
          email: string
          empresa?: string | null
          id?: string
          nome: string
          status?: string | null
          telefone?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          descricao_necessidade?: string
          email?: string
          empresa?: string | null
          id?: string
          nome?: string
          status?: string | null
          telefone?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "editor"
        | "assinante_premium"
        | "assinante_corporativo"
        | "gratuito"
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
      app_role: [
        "admin",
        "editor",
        "assinante_premium",
        "assinante_corporativo",
        "gratuito",
      ],
    },
  },
} as const
