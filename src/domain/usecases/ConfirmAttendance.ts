// src/domain/usecases/ConfirmAttendance.ts
import { AttendanceRepository } from '../repositories/AttendanceRepository';

export class ConfirmAttendance {
  constructor(private attendanceRepository: AttendanceRepository) {}

  execute(): string {
    return this.attendanceRepository.getWhatsAppConfirmationUrl();
  }
}
