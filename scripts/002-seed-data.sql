-- Seed data for SmartForm
-- This script adds sample forms and submissions for testing

-- Clear existing data
DELETE FROM chat_interactions;
DELETE FROM form_submissions;
DELETE FROM forms;
DELETE FROM "User";

-- Insert demo user for foreign key constraints
INSERT INTO "User" (id, email, name, createdAt, updatedAt)
VALUES ('demo-user-id', 'demo@example.com', 'Demo User', NOW(), NOW());

-- Insert sample forms (new schema)
INSERT INTO "Form" (id, "ownerId", title, description, "isActive", "createdAt", "updatedAt") VALUES
  ('form-001', 'demo-user-id', 'Contact Us', 'Get in touch with our team and we''ll respond within 24 hours', true, NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day'),
  ('form-002', 'demo-user-id', 'Newsletter Signup', 'Stay updated with our latest news, product updates, and industry insights', true, NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 hours'),
  ('form-003', 'demo-user-id', 'Product Demo Request', 'Request a personalized demo of our platform', true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 hour');

-- (Optional) Remove or update the old forms and submissions inserts below if you want to seed more data for related tables.

-- Insert sample form submissions
INSERT INTO form_submissions (id, form_id, submission_data, ai_response, user_responded, user_response, ip_address, user_agent, created_at) VALUES
(
  '660e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440001',
  '{
    "name": "John Smith",
    "email": "john.smith@techstartup.com",
    "company": "TechStartup Inc",
    "subject": "Sales",
    "message": "Hi, I''m interested in learning more about your enterprise solutions. We''re a growing startup with about 50 employees and looking for a comprehensive platform."
  }'::jsonb,
  'Thank you for your interest in our enterprise solutions, John! It sounds like TechStartup Inc is at an exciting growth stage. I''d love to learn more about your specific needs. Would you be interested in scheduling a 30-minute demo call this week to discuss how our platform can support your team of 50?',
  true,
  'yes',
  '192.168.1.100',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  NOW() - INTERVAL '2 hours'
),
(
  '660e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440001',
  '{
    "name": "Sarah Johnson",
    "email": "sarah@designstudio.com",
    "company": "Creative Design Studio",
    "subject": "Partnership",
    "message": "We''re a design agency and would like to explore partnership opportunities. We have several clients who could benefit from your services."
  }'::jsonb,
  'Hi Sarah! Partnership opportunities are always exciting to explore. I''d love to learn more about Creative Design Studio and your client base. Could we schedule a brief call to discuss potential collaboration opportunities? What types of services do your clients typically need?',
  false,
  null,
  '192.168.1.101',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  NOW() - INTERVAL '4 hours'
),
(
  '660e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440002',
  '{
    "email": "mike.chen@example.com",
    "firstName": "Mike",
    "lastName": "Chen",
    "interests": true,
    "frequency": "Weekly"
  }'::jsonb,
  'Welcome to our newsletter, Mike! Thanks for subscribing to weekly updates. You''ll receive valuable insights about industry trends, product updates, and best practices. Are there any specific topics you''re most interested in learning about?',
  true,
  'yes',
  '192.168.1.102',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
  NOW() - INTERVAL '1 day'
),
(
  '660e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440004',
  '{
    "customerName": "Lisa Rodriguez",
    "email": "lisa.r@email.com",
    "rating": "Excellent",
    "recommendation": "Definitely",
    "feedback": "The platform is intuitive and the customer support team is fantastic. Really helped streamline our workflow."
  }'::jsonb,
  'Thank you so much for the excellent feedback, Lisa! We''re thrilled to hear that our platform has helped streamline your workflow and that you had a great experience with our support team. What specific features have been most valuable for your team?',
  false,
  null,
  '192.168.1.103',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  NOW() - INTERVAL '3 hours'
);

-- Insert chat interactions
INSERT INTO chat_interactions (id, submission_id, message, is_ai, created_at) VALUES
(
  '770e8400-e29b-41d4-a716-446655440001',
  '660e8400-e29b-41d4-a716-446655440001',
  'Thank you for your interest in our enterprise solutions, John! It sounds like TechStartup Inc is at an exciting growth stage. I''d love to learn more about your specific needs. Would you be interested in scheduling a 30-minute demo call this week to discuss how our platform can support your team of 50?',
  true,
  NOW() - INTERVAL '2 hours'
),
(
  '770e8400-e29b-41d4-a716-446655440002',
  '660e8400-e29b-41d4-a716-446655440001',
  'yes',
  false,
  NOW() - INTERVAL '1 hour 50 minutes'
),
(
  '770e8400-e29b-41d4-a716-446655440003',
  '660e8400-e29b-41d4-a716-446655440001',
  'Perfect! I''ll have our sales team reach out to you within the next business day to schedule a demo. In the meantime, feel free to check out our case studies on our website. Is there a preferred time of day for the call?',
  true,
  NOW() - INTERVAL '1 hour 45 minutes'
),
(
  '770e8400-e29b-41d4-a716-446655440004',
  '660e8400-e29b-41d4-a716-446655440002',
  'Hi Sarah! Partnership opportunities are always exciting to explore. I''d love to learn more about Creative Design Studio and your client base. Could we schedule a brief call to discuss potential collaboration opportunities? What types of services do your clients typically need?',
  true,
  NOW() - INTERVAL '4 hours'
),
(
  '770e8400-e29b-41d4-a716-446655440005',
  '660e8400-e29b-41d4-a716-446655440003',
  'Welcome to our newsletter, Mike! Thanks for subscribing to weekly updates. You''ll receive valuable insights about industry trends, product updates, and best practices. Are there any specific topics you''re most interested in learning about?',
  true,
  NOW() - INTERVAL '1 day'
),
(
  '770e8400-e29b-41d4-a716-446655440006',
  '660e8400-e29b-41d4-a716-446655440003',
  'yes',
  false,
  NOW() - INTERVAL '23 hours'
),
(
  '770e8400-e29b-41d4-a716-446655440007',
  '660e8400-e29b-41d4-a716-446655440003',
  'Great! I''d recommend focusing on AI and automation trends, as well as productivity tips. You''ll find our content very valuable. Thanks for being part of our community!',
  true,
  NOW() - INTERVAL '22 hours 50 minutes'
),
(
  '770e8400-e29b-41d4-a716-446655440008',
  '660e8400-e29b-41d4-a716-446655440004',
  'Thank you so much for the excellent feedback, Lisa! We''re thrilled to hear that our platform has helped streamline your workflow and that you had a great experience with our support team. What specific features have been most valuable for your team?',
  true,
  NOW() - INTERVAL '3 hours'
);
