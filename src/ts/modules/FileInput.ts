export class FileInput {  
  dataNameFileInput: string;
  dataNameFileInputList: string;
  dataNameFileInputFileName: string;
  dataNameFileInputFileRemove: string;
  dataNameFileInputThumbnailPreview: string;
  dataNameFileInputThumbnailRemove: string;
  fileInputElements: NodeList;
  selectedFilesMap: Map<HTMLInputElement, File[]> = new Map();
  fileConstraintsMap: Map<HTMLInputElement, {
    accept?: string[];
    maxSize?: string | number;
    maxCount?: number;
  }> = new Map();
  
  constructor(parameter: { 
    dataNameFileInput: string;
    dataNameFileInputList: string;
    dataNameFileInputFileName: string;
    dataNameFileInputFileRemove: string;
    dataNameFileInputThumbnailPreview: string;
    dataNameFileInputThumbnailRemove: string;
  }) {
    this.dataNameFileInput = parameter.dataNameFileInput;
    this.dataNameFileInputList = parameter.dataNameFileInputList;
    this.dataNameFileInputFileName = parameter.dataNameFileInputFileName;
    this.dataNameFileInputFileRemove = parameter.dataNameFileInputFileRemove;
    this.dataNameFileInputThumbnailPreview = parameter.dataNameFileInputThumbnailPreview;
    this.dataNameFileInputThumbnailRemove = parameter.dataNameFileInputThumbnailRemove;
    this.fileInputElements = document.querySelectorAll(`[data-su-js="${this.dataNameFileInput}"]`);
    this.init();
  }

  init() {
    Array.from(this.fileInputElements).forEach((fileInputElement) => {
      const fileInput = fileInputElement as HTMLInputElement;
      const fileInputSelector = fileInput?.querySelector(`input[type="file"]`) as HTMLInputElement;
      this.selectedFilesMap.set(fileInput, []);
      this.readConstraints(fileInput);
      fileInputSelector.addEventListener('input', (event) => {
        const inputElement = event.target as HTMLInputElement;
        const validationResult = this.validateFiles(fileInput, inputElement.files);
        // validation result
        if (validationResult.valid) {
          this.selectFiles(fileInput, inputElement);
        } else {
          alert(validationResult.errors.join('\n'));
          inputElement.value = '';
        }
      });
      // file unselect from list
      fileInput.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        const removeButton = target.closest(`[data-su-js="${this.dataNameFileInputFileRemove}"]`) as HTMLElement;
        if (removeButton) {
          this.removeFile(fileInput, removeButton);
        }
      });
      // file unselect from thumbnail
      fileInput.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        const thumbnailRemoveButton = target.closest(`[data-su-js="${this.dataNameFileInputThumbnailRemove}"]`) as HTMLElement;
        if (thumbnailRemoveButton) {
          this.removeThumbnail(fileInput, thumbnailRemoveButton);
        }
      });
    });
  }

  // logFileList(message: string, fileList: FileList | null) {
  //   console.group(`FileInput: ${message}`);  
  //   if (!fileList || fileList.length === 0) {
  //     console.log('ファイルリストは空です');
  //     console.groupEnd();
  //     return;
  //   }
  //   console.log(`ファイル数: ${fileList.length}`);
  //   Array.from(fileList).forEach((file, index) => {
  //     console.group(`ファイル ${index + 1}`);
  //     console.log(`名前: ${file.name}`);
  //     console.log(`サイズ: ${file.size} バイト`);
  //     console.log(`タイプ: ${file.type}`);
  //     console.log(`最終更新日時: ${new Date(file.lastModified).toLocaleString()}`);
  //     console.groupEnd();
  //   });
  //   console.groupEnd();
  // }
  
  selectFiles(fileInput: HTMLInputElement, fileInputSelector: HTMLInputElement) {
    // this.logFileList('新しく選択されたファイル', fileInputSelector.files);
    const newFiles = Array.from(fileInputSelector.files || []);
    const existingFiles = this.selectedFilesMap.get(fileInput) || [];
    const updatedFiles = [...existingFiles, ...newFiles];
    this.selectedFilesMap.set(fileInput, updatedFiles);
    const dataTransfer = new DataTransfer();
    updatedFiles.forEach(file => {
      dataTransfer.items.add(file);
    });
    fileInputSelector.files = dataTransfer.files;
    // this.logFileList('DataTransfer適用後のファイルリスト', fileInputSelector.files);
    this.displaySelectedFiles(fileInput);
    this.displayThumbnailPreview(fileInput);
  }

  displaySelectedFiles(fileInput: HTMLInputElement) {
    const fileInputList = fileInput?.querySelector(`[data-su-js="${this.dataNameFileInputList}"]`) as HTMLElement | null;
    const selectedFiles = this.selectedFilesMap.get(fileInput) || [];
    if (fileInputList) {
      if (selectedFiles.length > 0) {
        fileInputList.style.display = 'grid';
      } else {
        fileInputList.style.display = 'none';
      }
      fileInputList.replaceChildren();
      selectedFiles.forEach((selectedFile, index) => {
        // escape file name (XSS protection)
        const escapeHTML = (str: string) => {
          return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
        };
        const fileName = escapeHTML(selectedFile.name);
        const fileSize = this.formatFileSize(selectedFile.size);
        const listItemHtml = `
          <div 
            class="su-form-file-input-list-item" 
            data-file-index="${index}" 
            role="listitem"
          >
            <button 
              type="button" 
              class="su-form-file-input-file-remove" 
              data-su-js="${this.dataNameFileInputFileRemove}"
              aria-label="${fileName} (${fileSize}) を削除"
            >
              <span 
                class="su-icon-delete su-form-file-input-file-remove-icon" 
                aria-hidden="true"
              ></span>
            </button>
            <span class="su-form-file-input-file-name">${fileName}</span>
          </div>
        `;
        fileInputList.insertAdjacentHTML('beforeend', listItemHtml);
      });
    }
  }

  displayThumbnailPreview(fileInput: HTMLInputElement) {
    const thumbnailPreview = fileInput?.querySelector(`[data-su-js="${this.dataNameFileInputThumbnailPreview}"]`) as HTMLElement | null;
    const selectedFiles = this.selectedFilesMap.get(fileInput) || [];
    if (thumbnailPreview) {
      if (selectedFiles.length > 0) {
        thumbnailPreview.style.display = 'flex';
      } else {
        thumbnailPreview.style.display = 'none';
      }
    }
    thumbnailPreview?.replaceChildren();
    selectedFiles.forEach((selectedFile, index) => {
      // escape file name (XSS protection)
      const escapeHTML = (str: string) => {
        return str
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      };
      const fileName = escapeHTML(selectedFile.name);
      const fileType = selectedFile.type;
      const fileSize = this.formatFileSize(selectedFile.size);
      // file type description
      let fileTypeDescription = '';
      if (fileType.startsWith('image/')) {
        fileTypeDescription = '画像';
      } else if (fileType.startsWith('video/')) {
        fileTypeDescription = '動画';
      } else {
        fileTypeDescription = 'ファイル';
      }
      const thumbnailPreviewHtml = `
        <figure 
          class="su-form-file-input-thumbnail-preview-thumbnail" 
          data-file-index="${index}"
          role="listitem"
        >
          ${selectedFile.type.startsWith('image/') ? `
            <img 
              src="${URL.createObjectURL(selectedFile)}" 
              alt="${fileName} ${fileTypeDescription}" 
              class="su-form-file-input-thumbnail-preview-image" 
            />
          ` : selectedFile.type.startsWith('video/') ? `
            <canvas 
              class="su-form-file-input-thumbnail-preview-canvas" 
              data-video-src="${URL.createObjectURL(selectedFile)}"
              data-su-js="su-form-file-input-thumbnail-preview-canvas"
              aria-label="${fileName} ${fileTypeDescription}"
            ></canvas>
            <figcaption 
              class="su-form-file-input-thumbnail-preview-duration"
              data-su-js="su-form-file-input-thumbnail-preview-duration"
            ></figcaption>
          ` : `
            <span 
              class="su-form-file-input-thumbnail-preview-file"
              aria-label="${fileName} ${fileTypeDescription}"
            >
              <span 
                class="su-icon-document su-form-file-input-thumbnail-preview-file-icon"
                aria-hidden="true"
              ></span>
            </span>
          `}
          <button 
            type="button" 
            class="su-form-file-input-thumbnail-preview-remove"
            data-su-js="${this.dataNameFileInputThumbnailRemove}"
            aria-label="${fileName} (${fileSize}) のサムネイルを削除"
          >
            <span 
              class="su-icon-delete su-form-file-input-file-remove-icon"
              aria-hidden="true"
            ></span>
          </button>
        </figure>
      `;
      thumbnailPreview?.insertAdjacentHTML('beforeend', thumbnailPreviewHtml);
    });
    this.generateVideoThumbnails(thumbnailPreview);
  }

  generateVideoThumbnails(container: HTMLElement | null) {
    if (!container) return;
    const canvasElements = Array.from(container.querySelectorAll('[data-su-js="su-form-file-input-thumbnail-preview-canvas"]'));
    const durationElements = Array.from(container.querySelectorAll('[data-su-js="su-form-file-input-thumbnail-preview-duration"]'));
    // sequentially process videos
    const processNextVideo = (index = 0) => {
      if (index >= canvasElements.length) return;
      const canvasElement = canvasElements[index] as HTMLCanvasElement;
      const durationElement = durationElements[index];
      const videoSrc = canvasElement.getAttribute('data-video-src');
      if (!videoSrc) {
        processNextVideo(index + 1);
        return;
      }
      // create video element (temporary)
      const videoElement = document.createElement('video');
      videoElement.style.display = 'none';
      videoElement.src = videoSrc;
      videoElement.muted = true;
      videoElement.controls = false;
      // loadedmetadata after calculating duration
      videoElement.addEventListener('loadedmetadata', () => {
        const duration = videoElement.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        const timeText = document.createTextNode(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        durationElement.appendChild(timeText);
        videoElement.currentTime = 0.1;
      });
      // seeking after drawing to canvas
      videoElement.addEventListener('seeked', () => {
        const ctx = canvasElement.getContext('2d');
        if (ctx) {
          canvasElement.width = videoElement.videoWidth;
          canvasElement.height = videoElement.videoHeight;
          ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
          // after processing the current video, process the next video
          setTimeout(() => {
            URL.revokeObjectURL(videoSrc);
            videoElement.remove();
            processNextVideo(index + 1);
          }, 100);
        }
      });
      // error handling
      videoElement.addEventListener('error', () => {
        durationElement.textContent = '--:--:--';
        setTimeout(() => {
          URL.revokeObjectURL(videoSrc);
          videoElement.remove();
          processNextVideo(index + 1);
        }, 100);
      });
      document.body.appendChild(videoElement);
    };
    // start processing
    processNextVideo();
  }

  removeFile(fileInput: HTMLInputElement, removeButton: HTMLElement) {
    const listItem = removeButton.closest('.su-form-file-input-list-item') as HTMLElement;
    if (listItem) {
      const fileIndex = parseInt(listItem.getAttribute('data-file-index') || '-1');
      if (fileIndex >= 0) {
        const files = this.selectedFilesMap.get(fileInput) || [];
        // console.log(`削除するファイル (インデックス: ${fileIndex}):`);
        // console.group('削除するファイル');
        // if (files[fileIndex]) {
        //   console.log(`名前: ${files[fileIndex].name}`);
        //   console.log(`サイズ: ${files[fileIndex].size} バイト`);
        //   console.log(`タイプ: ${files[fileIndex].type}`);
        // }
        // console.groupEnd();
        files.splice(fileIndex, 1);
        this.selectedFilesMap.set(fileInput, files);
        const fileInputSelector = fileInput?.querySelector(`input[type="file"]`) as HTMLInputElement;
        const dataTransfer = new DataTransfer();
        files.forEach(file => {
          dataTransfer.items.add(file);
        });
        fileInputSelector.files = dataTransfer.files;
        // this.logFileList('ファイル削除後のファイルリスト', fileInputSelector.files);
        this.displaySelectedFiles(fileInput);
        this.displayThumbnailPreview(fileInput);
      }
    }
  }

  removeThumbnail(fileInput: HTMLInputElement, removeButton: HTMLElement) {
    const thumbnail = removeButton.closest('.su-form-file-input-thumbnail-preview-thumbnail') as HTMLElement;
    if (thumbnail) {
      const fileIndex = parseInt(thumbnail.getAttribute('data-file-index') || '-1');
      if (fileIndex >= 0) {
        const files = this.selectedFilesMap.get(fileInput) || [];
        files.splice(fileIndex, 1);
        this.selectedFilesMap.set(fileInput, files);
        const fileInputSelector = fileInput?.querySelector(`input[type="file"]`) as HTMLInputElement;
        const dataTransfer = new DataTransfer();
        files.forEach(file => {
          dataTransfer.items.add(file);
        });
        fileInputSelector.files = dataTransfer.files;
        this.displaySelectedFiles(fileInput);
        this.displayThumbnailPreview(fileInput);
      }
    }
  }

  // read constraints
  readConstraints(fileInput: HTMLInputElement) {
    const constraintsAttr = fileInput.getAttribute('data-su-file-constraints');
    if (!constraintsAttr) return;
    try {
      const constraints = JSON.parse(constraintsAttr);
      this.fileConstraintsMap.set(fileInput, constraints);
    } catch (error) {
      console.error('Error parsing file constraints:', error);
    }
  }
  
  // validate
  validateFiles(fileInput: HTMLInputElement, newFiles: FileList | null): { 
    valid: boolean; 
    errors: string[] 
  } {
    const constraints = this.fileConstraintsMap.get(fileInput);
    const errors: string[] = [];
    if (!constraints || !newFiles || newFiles.length === 0) {
      return { valid: true, errors };
    }
    const existingFiles = this.selectedFilesMap.get(fileInput) || [];
    const totalFileCount = existingFiles.length + newFiles.length;
    // validate file count
    if (constraints.maxCount && totalFileCount > constraints.maxCount) {
      errors.push(`・選択可能なファイル数を超えています。【最大${constraints.maxCount}ファイル】まで選択できます。`);
    }
    Array.from(newFiles).forEach(file => {
      // validate file type
      if (constraints.accept && constraints.accept.length > 0) {
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        const isValidType = constraints.accept.some(type => {
          // validate file extension (e.g. .jpg)
          if (type.startsWith('.')) {
            return type.toLowerCase() === fileExtension;
          }
          // validate MIME type (e.g. image/*)
          else if (type.includes('/')) {
            return file.type.match(new RegExp(type.replace('*', '.*')));
          }
          // validate file extension (e.g. pdf)
          else {
            return fileExtension === `.${type.toLowerCase()}`;
          }
        });
        if (!isValidType) {
          const acceptableTypes = constraints.accept.join(', ');
          errors.push(`・許可されていないファイル形式が含まれています。【${acceptableTypes}】のファイル形式のみ許可されています。`);
        }
      }
      // validate file size
      if (constraints.maxSize) {
        const maxSizeBytes = typeof constraints.maxSize === 'number' 
          ? constraints.maxSize 
          : this.convertSizeToBytes(constraints.maxSize); 
        if (file.size > maxSizeBytes) {
          const maxSizeMB = Math.round(maxSizeBytes / 1024 / 1024 * 10) / 10;
          errors.push(`・ファイルサイズが大きいものが含まれています。【${maxSizeMB}MB】以下のファイルを選択してください。`);
        }
      }
    });
    return {
      valid: errors.length === 0,
      errors: [...new Set(errors)]
    };
  }
  
  // convert size string to bytes
  convertSizeToBytes(sizeStr: string): number {
    const regex = /^(\d+(?:\.\d+)?)\s*(KB|MB|GB|B)?$/i;
    const match = sizeStr.match(regex);
    if (!match) return 0;
    const size = parseFloat(match[1]);
    const unit = (match[2] || 'B').toUpperCase();
    switch (unit) {
      case 'KB': return size * 1024;
      case 'MB': return size * 1024 * 1024;
      case 'GB': return size * 1024 * 1024 * 1024;
      default: return size;
    }
  }

  // format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // set & get form data
  // appendFilesToFormData(fileInput: HTMLInputElement, formData: FormData): FormData {
  //   const files = this.selectedFilesMap.get(fileInput) || [];
  //   files.forEach((file) => {
  //     formData.append('files[]', file, file.name);
  //   });
  //   return formData;
  // }
}

// use as global variable
// declare global {
//   interface Window {
//     FileInput: typeof FileInput;
//   }
// }
// window.FileInput = FileInput;
