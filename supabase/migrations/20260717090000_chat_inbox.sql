-- Efficient, RLS-safe conversation inbox for returning users.

CREATE OR REPLACE FUNCTION public.get_user_conversations()
RETURNS TABLE (
  conversation_id uuid,
  participant_id uuid,
  participant_name text,
  participant_avatar text,
  last_message text,
  last_message_at timestamptz,
  unread_count bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    conversation.id,
    other_member.user_id,
    COALESCE(profile.full_name, 'مستخدم'),
    profile.avatar_url,
    latest_message.content,
    COALESCE(conversation.last_message_at, conversation.created_at),
    (
      SELECT COUNT(*)
      FROM public.messages unread_message
      WHERE unread_message.conversation_id = conversation.id
        AND unread_message.sender_id <> auth.uid()
        AND unread_message.created_at > COALESCE(own_member.last_read_at, own_member.joined_at)
    )
  FROM public.conversation_members own_member
  JOIN public.conversations conversation
    ON conversation.id = own_member.conversation_id
  JOIN LATERAL (
    SELECT member.user_id
    FROM public.conversation_members member
    WHERE member.conversation_id = conversation.id
      AND member.user_id <> auth.uid()
    ORDER BY member.joined_at
    LIMIT 1
  ) other_member ON true
  LEFT JOIN public.profiles profile ON profile.id = other_member.user_id
  LEFT JOIN LATERAL (
    SELECT message.content
    FROM public.messages message
    WHERE message.conversation_id = conversation.id
    ORDER BY message.created_at DESC
    LIMIT 1
  ) latest_message ON true
  WHERE own_member.user_id = auth.uid()
  ORDER BY COALESCE(conversation.last_message_at, conversation.created_at) DESC;
$$;

REVOKE ALL ON FUNCTION public.get_user_conversations() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_user_conversations() TO authenticated;
