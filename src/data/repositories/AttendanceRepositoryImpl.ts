// src/data/repositories/AttendanceRepositoryImpl.ts
import { AttendanceRepository } from '../../domain/repositories/AttendanceRepository';
import { UrlParameterDataSource } from '../datasources/UrlParameterDataSource';

export class AttendanceRepositoryImpl implements AttendanceRepository {
  private phoneNumber = '525565235192';

  constructor(private urlParameterDataSource: UrlParameterDataSource) {}

  getTicketsCount(): number | null {
    const boletosStr = this.urlParameterDataSource.getParam('boletos');
    if (boletosStr) {
      const count = parseInt(boletosStr, 10);
      if (!isNaN(count) && count > 0) return count;
    }

    const passStr = this.urlParameterDataSource.getParam('pass');
    if (passStr) {
      // 1. Matches themed M<number> format (e.g., M2, M3)
      const themedMatch = passStr.match(/^M(\d+)$/i);
      if (themedMatch) {
        const count = parseInt(themedMatch[1], 10);
        if (!isNaN(count) && count > 0) return count;
      }

      // 2. Matches Base64 encoded number format (e.g. Mg == 2, Mw == 3, NA == 4)
      try {
        let base64 = passStr;
        if (base64.length === 2) base64 += '==';
        else if (base64.length === 3) base64 += '=';
        const decoded = atob(base64);
        const count = parseInt(decoded, 10);
        if (!isNaN(count) && count > 0) return count;
      } catch (e) {
        // ignore
      }

      // 3. Fallback to raw numeric check
      const count = parseInt(passStr, 10);
      if (!isNaN(count) && count > 0) return count;
    }

    return null;
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
