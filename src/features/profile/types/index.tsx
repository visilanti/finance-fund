export interface ProfileRekening {
  id?: string;
  bank: string;
  noRekening: string;
  name: string;
  isDefault?: boolean;
}

export interface Profile {
  fullName: string;
  email: string;
  unit: string;
  roles: string[];
  rekeningAktif: ProfileRekening;
  daftarRekening?: ProfileRekening[];
  ttdUrl?: string;
  nip?: string;
  telepon?: string;
}
