export const CONTACTS = {
  support: {
    phone: "+233595731124",
    waLink: "https://wa.me/+233595731124",
    waLinkWithMsg: (msg: string) =>
      `https://wa.me/+233595731124?text=${encodeURIComponent(msg)}`,
  },
  community: {
    waGroupLink: "https://whatsapp.com/channel/0029Vb8nnX66hENo3np3rj0i",
  },
} as const;
