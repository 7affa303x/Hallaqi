/**
 * Hallaqi - Supabase Types
 * Auto-generated from Live Database Schema
 * Source of Truth: npkmqlupkvijhumkldpm
 * Generated: 2026-07-15
 */

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
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
          phone_number: string | null
          address: string | null
          city: string | null
          country: string | null
          user_role: Database["public"]["Enums"]["user_role"] | null
          user_status: Database["public"]["Enums"]["user_status"] | null
          verification_status: Database["public"]["Enums"]["verification_status"] | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          phone_number?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          user_role?: Database["public"]["Enums"]["user_role"] | null
          user_status?: Database["public"]["Enums"]["user_status"] | null
          verification_status?: Database["public"]["Enums"]["verification_status"] | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          phone_number?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          user_role?: Database["public"]["Enums"]["user_role"] | null
          user_status?: Database["public"]["Enums"]["user_status"] | null
          verification_status?: Database["public"]["Enums"]["verification_status"] | null
        }
        Relationships: []
      }
      professionals: {
        Row: {
          id: string
          bio: string | null
          average_rating: number | null
          review_count: number | null
          latitude: number | null
          longitude: number | null
          business_name: string | null
          business_address: string | null
          business_phone: string | null
          business_email: string | null
          website_url: string | null
        }
        Insert: {
          id: string
          bio?: string | null
          average_rating?: number | null
          review_count?: number | null
          latitude?: number | null
          longitude?: number | null
          business_name?: string | null
          business_address?: string | null
          business_phone?: string | null
          business_email?: string | null
          website_url?: string | null
        }
        Update: {
          id?: string
          bio?: string | null
          average_rating?: number | null
          review_count?: number | null
          latitude?: number | null
          longitude?: number | null
          business_name?: string | null
          business_address?: string | null
          business_phone?: string | null
          business_email?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professionals_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      services: {
        Row: {
          id: string
          professional_id: string | null
          name: string
          description: string | null
          price: number
          duration_minutes: number
          category: Database["public"]["Enums"]["service_category"] | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          professional_id?: string | null
          name: string
          description?: string | null
          price: number
          duration_minutes: number
          category?: Database["public"]["Enums"]["service_category"] | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          professional_id?: string | null
          name?: string
          description?: string | null
          price?: number
          duration_minutes?: number
          category?: Database["public"]["Enums"]["service_category"] | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_professional_id_fkey"
            columns: ["professional_id"]
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          }
        ]
      }
      bookings: {
        Row: {
          id: string
          client_id: string | null
          professional_id: string | null
          service_id: string | null
          booking_start_time: string
          booking_end_time: string
          status: Database["public"]["Enums"]["booking_status"] | null
          total_price: number
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          notes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          client_id?: string | null
          professional_id?: string | null
          service_id?: string | null
          booking_start_time: string
          booking_end_time: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_price: number
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          client_id?: string | null
          professional_id?: string | null
          service_id?: string | null
          booking_start_time?: string
          booking_end_time?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_price?: number
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_client_id_fkey"
            columns: ["client_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_professional_id_fkey"
            columns: ["professional_id"]
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            referencedRelation: "services"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          id: string
          booking_id: string | null
          reviewer_id: string | null
          professional_id: string | null
          rating: number
          comment: string | null
          is_public: boolean | null
          moderation_status: Database["public"]["Enums"]["moderation_status"] | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          booking_id?: string | null
          reviewer_id?: string | null
          professional_id?: string | null
          rating: number
          comment?: string | null
          is_public?: boolean | null
          moderation_status?: Database["public"]["Enums"]["moderation_status"] | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          booking_id?: string | null
          reviewer_id?: string | null
          professional_id?: string | null
          rating?: number
          comment?: string | null
          is_public?: boolean | null
          moderation_status?: Database["public"]["Enums"]["moderation_status"] | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_professional_id_fkey"
            columns: ["professional_id"]
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      favorites: {
        Row: {
          id: string
          user_id: string | null
          professional_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          professional_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          professional_id?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_professional_id_fkey"
            columns: ["professional_id"]
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          }
        ]
      }
      availability_schedules: {
        Row: {
          id: string
          professional_id: string | null
          day_of_week: number
          start_time: string
          end_time: string
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          professional_id?: string | null
          day_of_week: number
          start_time: string
          end_time: string
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          professional_id?: string | null
          day_of_week?: number
          start_time?: string
          end_time?: string
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "availability_schedules_professional_id_fkey"
            columns: ["professional_id"]
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          }
        ]
      }
      availability_exceptions: {
        Row: {
          id: string
          professional_id: string | null
          date: string
          type: string
          start_time: string | null
          end_time: string | null
          reason: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          professional_id?: string | null
          date: string
          type: string
          start_time?: string | null
          end_time?: string | null
          reason?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          professional_id?: string | null
          date?: string
          type?: string
          start_time?: string | null
          end_time?: string | null
          reason?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "availability_exceptions_professional_id_fkey"
            columns: ["professional_id"]
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          }
        ]
      }
      portfolio_items: {
        Row: {
          id: string
          professional_id: string | null
          type: Database["public"]["Enums"]["media_type"]
          url: string
          thumbnail_url: string | null
          caption: string | null
          sort_order: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          professional_id?: string | null
          type: Database["public"]["Enums"]["media_type"]
          url: string
          thumbnail_url?: string | null
          caption?: string | null
          sort_order?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          professional_id?: string | null
          type?: Database["public"]["Enums"]["media_type"]
          url?: string
          thumbnail_url?: string | null
          caption?: string | null
          sort_order?: number | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_items_professional_id_fkey"
            columns: ["professional_id"]
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          }
        ]
      }
      conversations: {
        Row: {
          id: string
          created_at: string | null
          updated_at: string | null
          last_message_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string | null
          updated_at?: string | null
          last_message_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          updated_at?: string | null
          last_message_at?: string | null
        }
        Relationships: []
      }
      conversation_members: {
        Row: {
          id: string
          conversation_id: string
          user_id: string
          joined_at: string | null
          last_read_at: string | null
        }
        Insert: {
          id?: string
          conversation_id: string
          user_id: string
          joined_at?: string | null
          last_read_at?: string | null
        }
        Update: {
          id?: string
          conversation_id?: string
          user_id?: string
          joined_at?: string | null
          last_read_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_members_conversation_id_fkey"
            columns: ["conversation_id"]
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_members_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          type: string | null
          status: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content: string
          type?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string
          type?: string | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string | null
          type: string
          title: string
          message: string
          read: boolean | null
          metadata: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          type: string
          title: string
          message: string
          read?: boolean | null
          metadata?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          type?: string
          title?: string
          message?: string
          read?: boolean | null
          metadata?: Json | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      forum_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          color: string | null
          sort_order: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          color?: string | null
          sort_order?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          color?: string | null
          sort_order?: number | null
          created_at?: string | null
        }
        Relationships: []
      }
      forum_posts: {
        Row: {
          id: string
          category_id: string | null
          author_id: string
          title: string
          content: string
          image_url: string | null
          type: string | null
          likes_count: number | null
          comments_count: number | null
          views_count: number | null
          is_pinned: boolean | null
          is_locked: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          category_id?: string | null
          author_id: string
          title: string
          content: string
          image_url?: string | null
          type?: string | null
          likes_count?: number | null
          comments_count?: number | null
          views_count?: number | null
          is_pinned?: boolean | null
          is_locked?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          category_id?: string | null
          author_id?: string
          title?: string
          content?: string
          image_url?: string | null
          type?: string | null
          likes_count?: number | null
          comments_count?: number | null
          views_count?: number | null
          is_pinned?: boolean | null
          is_locked?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_posts_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "forum_categories"
            referencedColumns: ["id"]
          }
        ]
      }
      forum_comments: {
        Row: {
          id: string
          post_id: string
          author_id: string
          content: string
          parent_id: string | null
          likes_count: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          post_id: string
          author_id: string
          content: string
          parent_id?: string | null
          likes_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          post_id?: string
          author_id?: string
          content?: string
          parent_id?: string | null
          likes_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_comments_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_comments_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_comments_parent_id_fkey"
            columns: ["parent_id"]
            referencedRelation: "forum_comments"
            referencedColumns: ["id"]
          }
        ]
      }
      forum_likes: {
        Row: {
          id: string
          user_id: string
          post_id: string | null
          comment_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          post_id?: string | null
          comment_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string | null
          comment_id?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_likes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_likes_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_likes_comment_id_fkey"
            columns: ["comment_id"]
            referencedRelation: "forum_comments"
            referencedColumns: ["id"]
          }
        ]
      }
      forum_reports: {
        Row: {
          id: string
          reporter_id: string
          post_id: string | null
          comment_id: string | null
          reason: string
          status: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          reporter_id: string
          post_id?: string | null
          comment_id?: string | null
          reason: string
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          reporter_id?: string
          post_id?: string | null
          comment_id?: string | null
          reason?: string
          status?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_reports_reporter_id_fkey"
            columns: ["reporter_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_reports_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_reports_comment_id_fkey"
            columns: ["comment_id"]
            referencedRelation: "forum_comments"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_or_create_conversation: {
        Args: { user1_id: string; user2_id: string }
        Returns: string
      }
      mark_conversation_messages_as_read: {
        Args: { p_conversation_id: string; p_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      booking_status: ["pending", "confirmed", "in_progress", "completed", "cancelled", "no_show"]
      media_type: ["image", "video"]
      moderation_status: ["pending", "approved", "rejected"]
      payment_status: ["pending", "paid", "refunded", "failed"]
      service_category: ["haircut", "beard", "shave", "hair_treatment", "facial", "coloring", "styling", "package"]
      user_role: ["client", "barber", "specialist", "admin", "moderator"]
      user_status: ["active", "inactive", "suspended", "pending"]
      verification_status: ["unverified", "pending", "verified", "premium"]
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// ====== CONVENIENCE TYPES ======

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]
export type TablesInsert<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"]
export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T]

// ====== ENTITY TYPES ======

export type Profile = Tables<"profiles">
export type Professional = Tables<"professionals">
export type Service = Tables<"services">
export type Booking = Tables<"bookings">
export type Review = Tables<"reviews">
export type Favorite = Tables<"favorites">
export type AvailabilitySchedule = Tables<"availability_schedules">
export type AvailabilityException = Tables<"availability_exceptions">
export type PortfolioItem = Tables<"portfolio_items">
export type Conversation = Tables<"conversations">
export type ConversationMember = Tables<"conversation_members">
export type Message = Tables<"messages">
export type Notification = Tables<"notifications">
export type ForumCategory = Tables<"forum_categories">
export type ForumPost = Tables<"forum_posts">
export type ForumComment = Tables<"forum_comments">
export type ForumLike = Tables<"forum_likes">
export type ForumReport = Tables<"forum_reports">

// ====== ENUM TYPES ======

export type UserRole = Enums<"user_role">
export type UserStatus = Enums<"user_status">
export type VerificationStatus = Enums<"verification_status">
export type BookingStatus = Enums<"booking_status">
export type PaymentStatus = Enums<"payment_status">
export type ServiceCategory = Enums<"service_category">
export type ModerationStatus = Enums<"moderation_status">
export type MediaType = Enums<"media_type">

// ====== API RESPONSE TYPES ======

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  perPage: number
  hasNext: boolean
  hasPrev: boolean
}

export interface AppError {
  code: string
  message: string
  timestamp: string
  context?: Record<string, unknown>
}
