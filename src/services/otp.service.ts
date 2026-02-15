import { httpClient } from "./httpClient";

export interface OTPSendRequest {
  type: "EMAIL";
  email: string;
}

export interface OTPVerifyRequest {
  type: "EMAIL";
  email: string;
  code: string;
}

export interface OTPResendRequest {
  type: "EMAIL";
  email: string;
}

export interface OTPResponse {
  message?: string;
  success?: boolean;
}

class OTPService {
  async sendOTP(email: string): Promise<OTPResponse> {
    const payload: OTPSendRequest = {
      type: "EMAIL",
      email,
    };

    return await httpClient.post<OTPResponse>("/v1/otp/send", payload);
  }

  async verifyOTP(email: string, code: string): Promise<OTPResponse> {
    const payload: OTPVerifyRequest = {
      type: "EMAIL",
      email,
      code,
    };

    return await httpClient.post<OTPResponse>("/v1/otp/verify", payload);
  }

  async resendOTP(email: string): Promise<OTPResponse> {
    const payload: OTPResendRequest = {
      type: "EMAIL",
      email,
    };

    return await httpClient.post<OTPResponse>("/v1/otp/resend", payload);
  }
}

export const otpService = new OTPService();
