// src/data/datasources/UrlParameterDataSource.ts

export class UrlParameterDataSource {
  getParam(key: string): string | null {
    if (typeof window === 'undefined') return null;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(key);
  }
}
