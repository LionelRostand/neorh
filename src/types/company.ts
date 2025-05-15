
export interface Company {
  id?: string;
  name: string;
  industry?: string;
  type?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  description?: string;
  logoUrl?: string;
  registrationDate?: string;
  status: string;
  logo?: {
    base64: string;
    type: string;
    name: string;
  };
}
