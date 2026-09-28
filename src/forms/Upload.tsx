import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react';
import { Icon } from '../foundations/Icon';

export type UploadRejectionReason =
  | 'file-too-large'
  | 'file-type-not-accepted'
  | 'too-many-files';

export interface UploadRejection {
  file: File;
  reason: UploadRejectionReason;
  message: string;
}

interface UploadValidationOptions {
  accept?: string;
  maxFiles?: number;
  maxSize?: number;
}

interface UploadValidationResult {
  accepted: File[];
  rejected: UploadRejection[];
}

export interface UploadProps extends UploadValidationOptions {
  label?: ReactNode;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  onReject?: (rejections: UploadRejection[]) => void;
  hint?: ReactNode;
  disabled?: boolean;
}

function formatFileSize(bytes: number) {
  if (bytes >= 1024 * 1024) {
    const megabytes = bytes / (1024 * 1024);
    return `${Number.isInteger(megabytes) ? megabytes : megabytes.toFixed(1)} MB`;
  }
  if (bytes >= 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${bytes} B`;
}

function acceptsFile(file: File, accept?: string) {
  if (!accept?.trim()) return true;
  const fileName = file.name.toLowerCase();
  const mimeType = file.type.toLowerCase();

  return accept
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
    .some((rule) => {
      if (rule.startsWith('.')) return fileName.endsWith(rule);
      if (rule.endsWith('/*')) return mimeType.startsWith(rule.slice(0, -1));
      return mimeType === rule;
    });
}

function validateUploadFiles(
  files: readonly File[],
  options: UploadValidationOptions = {},
): UploadValidationResult {
  const accepted: File[] = [];
  const rejected: UploadRejection[] = [];
  const limit = options.maxFiles ?? Number.POSITIVE_INFINITY;

  files.forEach((file) => {
    if (!acceptsFile(file, options.accept)) {
      rejected.push({ file, reason: 'file-type-not-accepted', message: '不支持该文件类型' });
      return;
    }
    if (options.maxSize !== undefined && file.size > options.maxSize) {
      rejected.push({
        file,
        reason: 'file-too-large',
        message: `文件不能超过 ${formatFileSize(options.maxSize)}`,
      });
      return;
    }
    if (accepted.length >= limit) {
      rejected.push({
        file,
        reason: 'too-many-files',
        message: `最多只能选择 ${limit} 个文件`,
      });
      return;
    }
    accepted.push(file);
  });

  return { accepted, rejected };
}

export function Upload({
  label = '上传文件',
  accept,
  multiple,
  maxFiles,
  maxSize,
  onFiles,
  onReject,
  hint,
  disabled,
}: UploadProps) {
  const id = useId();
  const ref = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [rejections, setRejections] = useState<UploadRejection[]>([]);

  const takeFiles = (list: FileList | null) => {
    const result = validateUploadFiles(Array.from(list ?? []), {
      accept,
      maxFiles,
      maxSize,
    });
    setRejections(result.rejected);
    onFiles(result.accepted);
    if (result.rejected.length) onReject?.(result.rejected);
  };

  return (
    <div className="hf-upload">
      <input
        ref={ref}
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(event: ChangeEvent<HTMLInputElement>) => takeFiles(event.target.files)}
      />
      <button
        type="button"
        disabled={disabled}
        className={dragging ? 'is-dragging' : ''}
        onClick={() => ref.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (!disabled) takeFiles(event.dataTransfer.files);
        }}
      >
        <Icon name="inbox" size={24} />
        <strong>{label}</strong>
        <span>拖放到这里，或点击选择</span>
      </button>
      {rejections.length > 0 && (
        <div className="hf-upload__errors" role="alert">
          {rejections.map(({ file, reason, message }, index) => (
            <span key={`${file.name}-${reason}-${index}`}>{file.name}：{message}</span>
          ))}
        </div>
      )}
      {hint && <small>{hint}</small>}
    </div>
  );
}
