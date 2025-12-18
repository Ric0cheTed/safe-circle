-- Create a table for check-in timers
CREATE TABLE public.checkin_timers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  duration_minutes INTEGER NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'checked_in', 'expired', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.checkin_timers ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own timers" 
ON public.checkin_timers 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own timers" 
ON public.checkin_timers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own timers" 
ON public.checkin_timers 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own timers" 
ON public.checkin_timers 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_checkin_timers_updated_at
BEFORE UPDATE ON public.checkin_timers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();