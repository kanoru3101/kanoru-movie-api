import slugify from "slugify";

type GenerateSlug = { str?: string };

export const genetateRandomString = (length: number): string => Math.random().toString(36).slice(2, length + 2);

export const generateSlug = ({ str }: GenerateSlug): string => {
  if (str) {
    return slugify(str, {
      locale: 'uk',
      lower: true,
    })
  }

  return `user-${genetateRandomString(5)}`
}

