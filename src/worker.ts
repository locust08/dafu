import handler, {
  createScheduledHandler,
  EmDashRoom,
  EmDashRoomSite,
  PluginBridge,
} from '@emdash-cms/cloudflare/worker';

export { EmDashRoom, EmDashRoomSite, PluginBridge };

interface Bindings {
  DAFU_SETUP_PASSWORD?: string;
}

export default {
  ...handler,
  async fetch(request, env, context) {
    let path: string;
    try {
      path = decodeURIComponent(new URL(request.url).pathname).replace(/\/+$/, '');
    } catch {
      return new Response('Invalid URL', { status: 400 });
    }
    const setupPage = path === '/_emdash/admin/setup';
    const setupWrite = request.method !== 'GET' && request.method !== 'HEAD'
      && (path === '/_emdash/api/setup' || path.startsWith('/_emdash/api/setup/'));

    // The first administrator registers a passkey on the public Worker.
    if (env.DAFU_SETUP_PASSWORD && (setupPage || setupWrite)) {
      const { DAFU_SETUP_PASSWORD: password } = env;
      const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('dafu-setup:' + password));
      const grant = 'dafu_setup=' + Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
      const granted = request.headers.get('Cookie')?.split(';').some((cookie) => cookie.trim() === grant);
      const authorized = request.headers.get('Authorization') === 'Basic ' + btoa('dafu:' + password);

      if (!granted && !authorized) {
        return new Response('DAFU administrator setup requires the launch password.', {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Basic realm="DAFU administrator setup", charset="UTF-8"',
            'Cache-Control': 'no-store',
            'X-Robots-Tag': 'noindex',
          },
        });
      }

      const response = await handler.fetch(request, env, context);
      if (!setupPage || granted) return response;
      const headers = new Headers(response.headers);
      headers.append('Set-Cookie', grant + '; Path=/_emdash; Max-Age=3600; Secure; HttpOnly; SameSite=Strict');
      headers.set('Cache-Control', 'no-store');
      return new Response(response.body, { status: response.status, headers });
    }
    return handler.fetch(request, env, context);
  },
  scheduled: createScheduledHandler(),
} satisfies ExportedHandler<Bindings>;
