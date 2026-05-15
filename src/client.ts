import axios, { AxiosInstance, AxiosError } from 'axios';

export class NinjaOneClient {
  private http: AxiosInstance;
  private accessToken = '';
  private tokenExpiry = 0;

  constructor(
    private baseUrl: string,
    private clientId: string,
    private clientSecret: string,
  ) {
    this.http = axios.create({
      baseURL: `${baseUrl}/v2`,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  private async ensureToken(): Promise<void> {
    if (this.accessToken && Date.now() < this.tokenExpiry) return;

    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      scope: 'monitoring management control',
    });

    try {
      const res = await axios.post<{ access_token: string; expires_in: number }>(
        `${this.baseUrl}/ws/oauth/token`,
        params.toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );
      this.accessToken = res.data.access_token;
      this.tokenExpiry = Date.now() + (res.data.expires_in - 60) * 1000;
    } catch (err) {
      throw new Error(`NinjaOne authentication failed: ${apiError(err)}`);
    }
  }

  private async authHeader(): Promise<Record<string, string>> {
    await this.ensureToken();
    return { Authorization: `Bearer ${this.accessToken}` };
  }

  async get<T = unknown>(path: string, params?: Record<string, unknown>): Promise<T> {
    try {
      const res = await this.http.get<T>(path, {
        params,
        headers: await this.authHeader(),
      });
      return res.data;
    } catch (err) {
      throw new Error(`GET ${path} failed: ${apiError(err)}`);
    }
  }

  async post<T = unknown>(path: string, body?: unknown): Promise<T> {
    try {
      const res = await this.http.post<T>(path, body, {
        headers: await this.authHeader(),
      });
      return res.data;
    } catch (err) {
      throw new Error(`POST ${path} failed: ${apiError(err)}`);
    }
  }

  async patch<T = unknown>(path: string, body?: unknown): Promise<T> {
    try {
      const res = await this.http.patch<T>(path, body, {
        headers: await this.authHeader(),
      });
      return res.data;
    } catch (err) {
      throw new Error(`PATCH ${path} failed: ${apiError(err)}`);
    }
  }

  async put<T = unknown>(path: string, body?: unknown): Promise<T> {
    try {
      const res = await this.http.put<T>(path, body, {
        headers: await this.authHeader(),
      });
      return res.data;
    } catch (err) {
      throw new Error(`PUT ${path} failed: ${apiError(err)}`);
    }
  }

  async delete<T = unknown>(path: string): Promise<T> {
    try {
      const res = await this.http.delete<T>(path, {
        headers: await this.authHeader(),
      });
      return res.data;
    } catch (err) {
      throw new Error(`DELETE ${path} failed: ${apiError(err)}`);
    }
  }
}

function apiError(err: unknown): string {
  if (err instanceof AxiosError) {
    const data = err.response?.data;
    if (data && typeof data === 'object') return JSON.stringify(data);
    if (typeof data === 'string' && data) return data;
    return err.message;
  }
  return String(err);
}
