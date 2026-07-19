// src/domain/usecases/GetTickets.ts
import { AttendanceRepository } from '../repositories/AttendanceRepository';

export class GetTickets {
  constructor(private attendanceRepository: AttendanceRepository) {}

  execute(): number | null {
    return this.attendanceRepository.getTicketsCount();
  }
}
