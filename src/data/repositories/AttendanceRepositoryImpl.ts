// src/data/repositories/AttendanceRepositoryImpl.ts
import { AttendanceRepository } from '../../domain/repositories/AttendanceRepository';
import { UrlParameterDataSource } from '../datasources/UrlParameterDataSource';

export class AttendanceRepositoryImpl implements AttendanceRepository {
  private phoneNumber = '525565235192';

  constructor(private urlParameterDataSource: UrlParameterDataSource) {}

  getTicketsCount(): number | null {
    const boletosStr = this.urlParameterDataSource.getParam('boletos');
    if (!boletosStr) return null;
    const count = parseInt(boletosStr, 10);
    return isNaN(count) || count <= 0 ? null : count;
  }

  getWhatsAppConfirmationUrl(): string {
    const tickets = this.getTicketsCount();
    let message = '';
    
    if (tickets !== null) {
      message = `¡Hola! Confirmo nuestra asistencia a la fiesta de Mateo Sebastian. Somos ${tickets} personas.`;
    } else {
      message = `¡Hola! Confirmo nuestra asistencia a la fiesta de Mateo Sebastian.`;
    }

    return `https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(message)}`;
  }
}
