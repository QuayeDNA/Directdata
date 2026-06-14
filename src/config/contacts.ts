export const CONTACTS = {
  support: {
    phone: "+233595731124",
    waLink: "https://wa.me/+233595731124",
    waLinkWithMsg: (msg: string) =>
      `https://wa.me/+233595731124?text=${encodeURIComponent(msg)}`,
  },
  community: {
    waGroupLink: "https://chat.whatsapp.com/GZd9FCxP9U9LMRHw7r7UXX",
  },
} as const;
