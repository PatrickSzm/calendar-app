declare module "speakeasy" {
  export function totpVerify(opts: {
    secret: string;
    encoding: string;
    token: string;
  }): boolean;

  export function generateSecret(): {
    base32: string;
    otpauth_url: string;
  };

  // For compatibility, also declare the default export
  const speakeasy: {
    totp: {
      verify(opts: {
        secret: string;
        encoding: string;
        token: string;
      }): boolean;
    };
    generateSecret(): {
      base32: string;
      otpauth_url: string;
    };
  };
  export default speakeasy;
}
