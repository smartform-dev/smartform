import { clerkMiddleware, createRouteMatcher, getAuth } from '@clerk/nextjs/server';
import { prisma } from "@/lib/db";

const isPublicRoute = createRouteMatcher([
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/webhooks/clerk',
]);

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}

// Custom middleware to sync Clerk user to local DB
const customMiddleware = clerkMiddleware(async (req) => {
    // Only run for authenticated, non-public routes
    if (!req || typeof req !== "object" || !("pathname" in req)) return;
    if (isPublicRoute(req)) return;

    const { userId, sessionClaims } = getAuth(req);
    if (!userId) return;

    // Check if user exists in local DB
    const existing = await prisma.users.findUnique({
        where: { external_id: userId },
    });

    if (!existing) {
        // Extract email from Clerk session claims (handle array/object cases)
        let email: string | null = null;
        if (sessionClaims?.email) {
            if (typeof sessionClaims.email === "string") {
                email = sessionClaims.email;
            } else if (Array.isArray(sessionClaims.email) && typeof sessionClaims.email[0] === "string") {
                email = sessionClaims.email[0];
            }
        } else if (typeof sessionClaims?.primary_email === "string") {
            email = sessionClaims.primary_email;
        }
        if (!email) return; // Cannot create user without email

        await prisma.users.create({
            data: {
                external_id: userId,
                email: email,
                // Add more fields if your users table requires them
            },
        });
    }
});

export default customMiddleware;
