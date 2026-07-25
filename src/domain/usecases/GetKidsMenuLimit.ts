import { AttendanceRepository } from '../repositories/AttendanceRepository';

export class GetKidsMenuLimit {
  constructor(private attendanceRepository: AttendanceRepository) {}

  execute(): number | null {
    return this.attendanceRepository.getKidsMenuLimit();
  }
}
