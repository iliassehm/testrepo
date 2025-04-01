export default function calculateAge(birthDate: string): string | null {
  if (!birthDate) return null;
  const birth = new Date(birthDate);

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age.toString();
}
