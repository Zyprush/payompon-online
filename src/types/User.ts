export interface User {
  id: string;
  firstname: string;
  middlename: string;
  lastname: string;
  email: string;
  number: string;
  gender: string;
  sitio: string;
  civilStatus: string;
  verified: boolean;
  validID: string;
  validIDType: string;
  selfie: string;
  infoErrors?: string;
  submitted: boolean;
  verifiedAt?: string; // Ensure this is consistently defined as string | undefined
  address: string;
}
