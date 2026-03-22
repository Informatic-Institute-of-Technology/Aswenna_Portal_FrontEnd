import type { UploadUserFilesRequest } from "./registration.service";

let _files: UploadUserFilesRequest = {};

export const registrationStore = {
  setFiles(files: UploadUserFilesRequest): void {
    _files = { ...files };
  },
  getFiles(): UploadUserFilesRequest {
    return { ..._files };
  },
  clear(): void {
    _files = {};
  },
};
