import { useState } from 'react';
import {
  Button,
  Calendar,
  DatePicker,
  Form,
  FormItem,
  Input,
  Slider,
  Stack,
  Switch,
  TimePicker,
  Upload,
  type UploadRejection,
} from '../src';

export function AdvancedFormShowcase() {
  const [date, setDate] = useState('2026-08-20');
  const [time, setTime] = useState('09:30');
  const [progress, setProgress] = useState(65);
  const [files, setFiles] = useState<File[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [lastRejection, setLastRejection] = useState<UploadRejection | null>(null);

  return (
    <section
      className="demo-section advanced-form-showcase"
      aria-labelledby="advanced-form-title"
    >
      <div className="demo-section__heading">
        <div>
          <p className="demo-kicker">ADVANCED FORMS</p>
          <h2 id="advanced-form-title">把复杂输入拆成清晰步骤</h2>
        </div>
        <span>日期、时间、范围与文件均使用一致的触发反馈</span>
      </div>
      <div className="advanced-form-showcase__grid">
        <article
          data-last-rejection-reason={lastRejection?.reason ?? ''}
          data-last-rejection-file={lastRejection?.file.name ?? ''}
          data-last-rejection-message={lastRejection?.message ?? ''}
        >
          <header><span>SCHEDULE</span><h3>安排发布窗口</h3></header>
          <Stack direction="row" gap={12}>
            <DatePicker label="发布日期" value={date} onChange={setDate} />
            <TimePicker label="发布时间" value={time} onChange={setTime} />
          </Stack>
          <Calendar value={date} onChange={setDate} />
        </article>
        <article>
          <header><span>DELIVERY</span><h3>完善交付信息</h3></header>
          <Switch
            label="禁用整张表单"
            checked={disabled}
            onChange={(event) => setDisabled(event.target.checked)}
          />
          <Form disabled={disabled} onSubmit={(event) => event.preventDefault()}>
            <FormItem label="版本名称" required>
              <Input aria-label="版本名称" placeholder="例如：夏季体验更新" />
            </FormItem>
            <FormItem label="灰度比例" hint="先向部分用户开放">
              <Slider value={progress} onChange={setProgress} />
            </FormItem>
            <FormItem label="发布附件">
              <Upload
                label="上传发布附件"
                accept=".pdf,.png"
                maxFiles={3}
                maxSize={1024 * 1024}
                onFiles={setFiles}
                onReject={(rejections) => setLastRejection(rejections.at(-1) ?? null)}
                hint={files.length ? `已选择 ${files.length} 个文件` : '支持 PDF、PNG，单个不超过 1 MB'}
              />
              {files.map((file) => <small key={file.name}>{file.name}</small>)}
            </FormItem>
            <Button>保存发布计划</Button>
          </Form>
        </article>
      </div>
    </section>
  );
}
