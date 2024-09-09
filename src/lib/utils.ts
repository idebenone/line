import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

interface DecryptedResult {
  [key: string]: string | string[];
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  return date.toLocaleDateString('en-US', options);
}

export function decryptCode(encodedString: string): DecryptedResult {
  const decodedString = decodeURIComponent(encodedString);
  const fields = decodedString.replace(/-$/, "").split("-");
  const result: DecryptedResult = {};
  fields.forEach(field => {
    const [key, value] = field.split(":");
    if (key && value) {
      if (result[key]) {
        result[key] = Array.isArray(result[key])
          ? [...result[key] as string[], value]
          : [result[key] as string, value];
      } else {
        result[key] = value;
      }
    }
  });

  return result;
}