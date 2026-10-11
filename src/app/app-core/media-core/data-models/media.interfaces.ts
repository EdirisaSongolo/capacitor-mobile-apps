export interface FileRules {
  allowedTypes: string[];
  maxFileSize: number;
  maxFiles: number;
}

export interface FileValidationResult {
  acceptedFiles: File[];
  rejectionReasons: string[];
}
