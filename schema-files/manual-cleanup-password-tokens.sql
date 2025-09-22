-- manual-cleanup-password-tokens.sql
-- MAINTENANCE SCRIPT: Manual cleanup of expired password reset tokens
-- 
-- PURPOSE: This script can be run directly in Supabase SQL editor for:
-- - Manual cleanup when needed
-- - Monitoring token usage and expiration
-- - Debugging password reset issues
-- - Database maintenance
--
-- WHEN TO USE:
-- - When automatic cleanup isn't working as expected
-- - For regular maintenance checks
-- - Before/after investigating password reset issues
-- - To verify the cleanup mechanism is working properly
--
-- SAFETY: This script only deletes expired and used tokens, never active ones

-- Show current token count before cleanup
SELECT 
    COUNT(*) as total_tokens,
    COUNT(*) FILTER (WHERE expires_at < NOW()) as expired_tokens,
    COUNT(*) FILTER (WHERE used = true) as used_tokens,
    COUNT(*) FILTER (WHERE expires_at >= NOW() AND used = false) as active_tokens
FROM public.password_reset_tokens;

-- Delete expired tokens
DELETE FROM public.password_reset_tokens 
WHERE expires_at < NOW();

-- Delete used tokens  
DELETE FROM public.password_reset_tokens 
WHERE used = true;

-- Show token count after cleanup
SELECT 
    COUNT(*) as remaining_tokens,
    COUNT(*) FILTER (WHERE expires_at >= NOW() AND used = false) as active_tokens
FROM public.password_reset_tokens;

-- Show remaining tokens details (for debugging)
SELECT 
    id,
    email,
    expires_at,
    used,
    attempts,
    created_at,
    (expires_at < NOW()) as is_expired,
    EXTRACT(EPOCH FROM (expires_at - NOW()))/60 as minutes_until_expiry
FROM public.password_reset_tokens
ORDER BY created_at DESC
LIMIT 10;