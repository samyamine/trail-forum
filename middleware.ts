import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import {NextRequest} from "next/server";

const locales = ['en', 'fr'];

// Get the preferred locale, similar to the above or using a library
function getLocale(request: NextRequest) {
    const headers: Record<string, string> = {};
    const defaultLocale = 'fr';

    request.headers.forEach((value, key) => (headers[key] = value));

    const languages = new Negotiator({ headers }).languages();

    return match(languages, locales, defaultLocale); // -> 'fr'
}

export function middleware(request: NextRequest) {
    // Check if there is any supported locale in the pathname
    const { pathname } = request.nextUrl;
    const pathnameIsMissingLocale = locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    if (pathnameIsMissingLocale) {
        // Redirect if there is no locale
        const locale = getLocale(request);
        request.nextUrl.pathname = `/${locale}${pathname}`;
        // e.g. incoming request is /products
        // The new URL is now /en-US/products
        return Response.redirect(request.nextUrl);
    }
}

export const config = {
    matcher: [
        // Skip all internal paths (_next)
        '/((?!_next).*)',
        // Optional: only run on root (/) URL
        // '/'
    ],
}
