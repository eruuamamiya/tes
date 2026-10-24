// baris 1
import {DiscordSDK, patchUrlMappings} from '@discord/embedded-app-sdk';
// ganti `const sdk = new DiscordSDK(...)` di dalam if (inDiscord) jadi:
sdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

/* Harus sama persis dengan URL Mappings di Developer Portal (maks. 10).
   target = host saja, tanpa https://  */
const MAPPINGS = [
  {prefix: '/api', target: 'api.nekostream.online'},
  {prefix: '/img', target: 'r2.nyomo.my.id/images'},  // poster
  // host gambar lain? tambahkan di sini, mis. {prefix: '/img2', target: 'host.lain.com'},
];

export let sdk = null;
export const inDiscord = new URLSearchParams(location.search).has('frame_id');

if (inDiscord) {
  patchUrlMappings(MAPPINGS);
  const sdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);
  await sdk.ready();

  /* poster/gambar -> lewat /.proxy */
  window.__px = u => {
    try {
      const x = new URL(u), m = MAPPINGS.find(k => k.target === x.hostname && k.prefix !== '/api');
      return m ? `/.proxy${m.prefix}${x.pathname}${x.search}` : u;
    } catch { return u; }
  };

  /* target=_blank diblokir di dalam Activity -> buka lewat Discord */
  document.addEventListener('click', e => {
    const a = e.target.closest?.('a[target="_blank"]');
    if (a && a.href) { e.preventDefault(); sdk.commands.openExternalLink({url: a.href}); }
  }, true);
}
