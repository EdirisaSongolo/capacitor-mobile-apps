import { Injectable } from '@angular/core';
import { AppResponseType } from '@domain-data-models/app-domain.enums';
import { AppResponseService } from '@domain-services/create-app-response/app-response.service';
import {
  FileRules,
  FileValidationResult,
  MediaConstants,
  MediaDesignation,
} from '@media-core/data-models';

@Injectable({
  providedIn: 'root',
})
export class FilePickerService {
  private readonly allowedImageTypes: string[] = ['jpeg', 'jpg', 'png', 'webp'];
  private readonly maxImageFileSize: number = 10 * 1024 * 1024;
  private readonly maxProfileImageFiles: number = 1;
  private readonly maxProfileMediaFiles: number = 10;

  constructor(private appResponse: AppResponseService) {}

  public selectImageFiles(mediaFiles: MediaDesignation): Promise<File[]> {
    const rules: FileRules = this.fileRules(mediaFiles);

    return new Promise(resolve => {
      const inputField = document.createElement('input');
      inputField.type = 'file';
      inputField.accept = rules.allowedTypes
        .map(allowedType => `.${allowedType}`)
        .join(',');
      inputField.multiple = rules.maxFiles > 1;

      inputField.onchange = () =>
        resolve(
          this.acceptSelection(Array.from(inputField.files ?? []), mediaFiles)
        );
      inputField.oncancel = () => resolve([]);

      inputField.click();
    });
  }

  public async validateFiles(
    files: File[],
    mediaFiles: MediaDesignation
  ): Promise<FileValidationResult> {
    const rules: FileRules = this.fileRules(mediaFiles);
    const rejectionReasons = new Set<string>();

    const allowedFiles: File[] = files.filter(file => {
      if (!this.isAllowedType(file, rules.allowedTypes)) {
        rejectionReasons.add(MediaConstants.FileErrors.unsupported_type);
        return false;
      }

      if (file.size > rules.maxFileSize) {
        rejectionReasons.add(MediaConstants.FileErrors.too_large);
        return false;
      }

      return true;
    });

    if (allowedFiles.length > rules.maxFiles) {
      rejectionReasons.add(MediaConstants.FileErrors.too_many);
    }

    return {
      acceptedFiles: allowedFiles.slice(0, rules.maxFiles),
      rejectionReasons: [...rejectionReasons],
    };
  }

  private fileRules(mediaFiles: MediaDesignation): FileRules {
    return {
      allowedTypes: this.allowedImageTypes,
      maxFileSize: this.maxImageFileSize,
      maxFiles:
        mediaFiles === MediaDesignation.profile_image
          ? this.maxProfileImageFiles
          : this.maxProfileMediaFiles,
    };
  }

  private async acceptSelection(
    files: File[],
    mediaFiles: MediaDesignation
  ): Promise<File[]> {
    const { acceptedFiles, rejectionReasons } = await this.validateFiles(
      files,
      mediaFiles
    );

    if (rejectionReasons.length > 0) {
      this.appResponse.createAppResponse(
        AppResponseType.warning,
        rejectionReasons
      );
    }

    return acceptedFiles;
  }

  private isAllowedType(file: File, allowedTypes: string[]): boolean {
    const extensionIndex: number = file.name.lastIndexOf('.');
    if (extensionIndex === -1) {
      return false;
    }

    const extension: string = file.name.slice(extensionIndex + 1).toLowerCase();
    return allowedTypes.includes(extension);
  }
}
