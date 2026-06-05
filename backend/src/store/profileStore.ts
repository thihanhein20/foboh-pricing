import { PricingProfile } from "../models/types";

let profiles: PricingProfile[] = [];

export function getAllProfiles(): PricingProfile[] {
  return profiles;
}

export function findProfileById(id: string): PricingProfile | undefined {
  return profiles.find((p) => p.id === id);
}

export function addProfile(profile: PricingProfile): void {
  profiles.push(profile);
}

export function updateProfileById(
  id: string,
  updates: Partial<PricingProfile>,
): PricingProfile | null {
  const index = profiles.findIndex((p) => p.id === id);
  if (index === -1) return null;
  profiles[index] = { ...profiles[index], ...updates };
  return profiles[index];
}

export function removeProfileById(id: string): boolean {
  const index = profiles.findIndex((p) => p.id === id);
  if (index === -1) return false;
  profiles.splice(index, 1);
  return true;
}
