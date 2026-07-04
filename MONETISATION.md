# Monetisation setup (AdSense) — off by default

The AdSense plumbing is wired but **completely inert** until you set two env
vars. No script loads and no ad renders while they're unset, so there are no
cookies and no consent banner needed. Turn it on only once you have real traffic
— pre-traction, ads earn ~nothing and add friction that can hurt the viral loop.

## When you're ready

1. **Apply for AdSense** at adsense.google.com. Approval needs a live site with
   real content and a privacy policy — you have both (`/privacy` is live and
   linked in the footer). Approval can take days to weeks.
2. **Add `ads.txt`.** Once approved, create `public/ads.txt` containing the line
   Google gives you, e.g. `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`.
3. **Create one ad unit** in the AdSense dashboard (a responsive display unit).
   Note its slot id.
4. **Set env vars in Vercel** (Settings → Environment Variables), then redeploy:
   ```
   NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
   NEXT_PUBLIC_ADSENSE_SLOT=1234567890
   ```
   The single unit appears below the death card (`components/AdSlot.tsx`), never
   interrupting the play loop.

## Before enabling in the UK/EU

AdSense uses cookies, so in the UK/EU you need a **consent banner** (a Consent
Management Platform) before showing personalised ads. Options: Google's own
"Privacy & messaging" CMP in AdSense (simplest), or a third-party CMP. This is
the one bit of friction ads bring — factor it in, and keep the banner minimal.

## Alternatives worth considering first

- **Sponsorship.** A `/partners` page + a sponsorable share-card footer or a
  sponsored gacha item ("The Greggs Pasty of Vitality"). The ironic-sponsor angle
  is itself PR-worthy, and it avoids cookies entirely. This is arguably a better
  fit than banner ads for a toy like this.
- **Just stay free** until you have enough traffic that monetisation is worth the
  friction. Reach first, revenue second.

## Rule of thumb

One unobtrusive unit, below the card, never in the loop. If ads ever make the
game feel worse to share, they're costing you more than they earn.
