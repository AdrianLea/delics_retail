// Blackout Sale helper.
// Products need the tag "Blackout Sale" plus a percentage tag like "Blackout 35".
// The label shows until BLACKOUT_END. The discounted price only shows
// between BLACKOUT_START and BLACKOUT_END, matching the Shopify automatic discounts.

export const BLACKOUT_START = new Date('2026-11-27T02:30:00+11:00');
export const BLACKOUT_END = new Date('2026-12-01T02:30:00+11:00');

export function getBlackoutSale(tags = []) {
  const now = new Date();
  if (!tags.includes('Blackout Sale') || now >= BLACKOUT_END) return null;

  const percentTag = tags.find((tag) => /^Blackout \d+$/.test(tag));
  const percent = percentTag ? parseInt(percentTag.split(' ')[1], 10) : 0;

  return {
    percent,
    priceActive: percent > 0 && now >= BLACKOUT_START,
  };
}

export function blackoutPrice(price, percent) {
  if (!price) return price;
  return {
    ...price,
    amount: (parseFloat(price.amount) * (1 - percent / 100)).toFixed(2),
  };
}
