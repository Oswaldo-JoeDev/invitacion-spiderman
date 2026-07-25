import { AttendanceRepository } from '../repositories/AttendanceRepository';

export class ShouldShowChildNote {
  constructor(private attendanceRepository: AttendanceRepository) {}

  execute(): boolean {
    return this.attendanceRepository.shouldShowChildNote();
  }
}
