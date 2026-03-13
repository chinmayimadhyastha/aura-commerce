
-- Products table
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price decimal NOT NULL,
  category text NOT NULL,
  image_url text,
  mood text,
  specs jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT TO public USING (true);

-- Shopping sessions
CREATE TABLE public.shopping_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_by uuid NOT NULL,
  invite_code text UNIQUE NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.shopping_sessions ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.session_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.shopping_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  display_name text,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(session_id, user_id)
);
ALTER TABLE public.session_participants ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.session_cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.shopping_sessions(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  added_by uuid NOT NULL,
  quantity int DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.session_cart_items ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.session_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.shopping_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.session_messages ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.session_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.shopping_sessions(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  vote boolean NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(session_id, product_id, user_id)
);
ALTER TABLE public.session_votes ENABLE ROW LEVEL SECURITY;

-- Group buying
CREATE TABLE public.group_deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_by uuid NOT NULL,
  invite_code text UNIQUE NOT NULL,
  target_participants int NOT NULL DEFAULT 5,
  discount_percent decimal NOT NULL DEFAULT 20,
  expires_at timestamptz NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.group_deals ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.group_deal_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES public.group_deals(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(deal_id, user_id)
);
ALTER TABLE public.group_deal_participants ENABLE ROW LEVEL SECURITY;

-- Security definer function to check session participation
CREATE OR REPLACE FUNCTION public.is_session_participant(_user_id uuid, _session_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.session_participants
    WHERE user_id = _user_id AND session_id = _session_id
  ) OR EXISTS (
    SELECT 1 FROM public.shopping_sessions
    WHERE id = _session_id AND created_by = _user_id
  )
$$;

-- RLS Policies for shopping_sessions
CREATE POLICY "Sessions viewable by participants" ON public.shopping_sessions
  FOR SELECT TO authenticated USING (public.is_session_participant(auth.uid(), id));
CREATE POLICY "Anyone can view session by invite code" ON public.shopping_sessions
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create sessions" ON public.shopping_sessions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

-- RLS for session_participants
CREATE POLICY "Participants viewable by session members" ON public.session_participants
  FOR SELECT TO authenticated USING (public.is_session_participant(auth.uid(), session_id));
CREATE POLICY "Authenticated users can join sessions" ON public.session_participants
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave sessions" ON public.session_participants
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS for session_cart_items
CREATE POLICY "Cart viewable by session members" ON public.session_cart_items
  FOR SELECT TO authenticated USING (public.is_session_participant(auth.uid(), session_id));
CREATE POLICY "Session members can add to cart" ON public.session_cart_items
  FOR INSERT TO authenticated WITH CHECK (public.is_session_participant(auth.uid(), session_id));
CREATE POLICY "Session members can remove from cart" ON public.session_cart_items
  FOR DELETE TO authenticated USING (public.is_session_participant(auth.uid(), session_id));

-- RLS for session_messages
CREATE POLICY "Messages viewable by session members" ON public.session_messages
  FOR SELECT TO authenticated USING (public.is_session_participant(auth.uid(), session_id));
CREATE POLICY "Session members can send messages" ON public.session_messages
  FOR INSERT TO authenticated WITH CHECK (public.is_session_participant(auth.uid(), session_id) AND auth.uid() = user_id);

-- RLS for session_votes
CREATE POLICY "Votes viewable by session members" ON public.session_votes
  FOR SELECT TO authenticated USING (public.is_session_participant(auth.uid(), session_id));
CREATE POLICY "Session members can vote" ON public.session_votes
  FOR INSERT TO authenticated WITH CHECK (public.is_session_participant(auth.uid(), session_id) AND auth.uid() = user_id);
CREATE POLICY "Users can change their vote" ON public.session_votes
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- RLS for group_deals
CREATE POLICY "Group deals viewable by everyone" ON public.group_deals
  FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can create deals" ON public.group_deals
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Creators can update their deals" ON public.group_deals
  FOR UPDATE TO authenticated USING (auth.uid() = created_by);

-- RLS for group_deal_participants
CREATE POLICY "Deal participants viewable by everyone" ON public.group_deal_participants
  FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can join deals" ON public.group_deal_participants
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Enable realtime for social features
ALTER PUBLICATION supabase_realtime ADD TABLE public.session_cart_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.session_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.session_votes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.session_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_deal_participants;
