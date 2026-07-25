// src/domain/repositories/AttendanceRepository.ts

export interface AttendanceRepository {
  getTicketsCount(): number | null;
  getWhatsAppConfirmationUrl(): string;
  shouldShowChildNote(): boolean;
  getKidsMenuLimit(): number | null;
}
