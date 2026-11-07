import { useForm } from 'react-hook-form';
import { Sparkles, FileText } from 'lucide-react';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import Select from '../common/Select.jsx';
import Textarea from '../common/Textarea.jsx';
import { CONTENT_TYPES, PLATFORMS } from '../../utils/constants.js';

export default function ContentForm({ onSubmit, loading }) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: { title: '', body: '', content_type: 'social_post', platform: 'linkedin' },
  });

  const body = watch('body');

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Input
        label="Content Title / Subject"
        placeholder="e.g. Q4 Executive Product Launch Announcement"
        required
        error={errors.title?.message}
        {...register('title', { required: 'Title is required' })}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Format Type"
          options={CONTENT_TYPES}
          required
          error={errors.content_type?.message}
          {...register('content_type', { required: 'Format type is required' })}
        />
        <Select
          label="Target Channel"
          options={PLATFORMS}
          error={errors.platform?.message}
          {...register('platform')}
        />
      </div>

      <Textarea
        label="Draft Copy / Text Body"
        placeholder="Type or paste draft copy here to run full AI guideline verification…"
        required
        rows={8}
        showCount
        maxLength={5000}
        value={body}
        error={errors.body?.message}
        {...register('body', {
          required: 'Content body is required',
          minLength: { value: 15, message: 'Content must be at least 15 characters' },
        })}
      />

      <div className="flex items-center justify-between gap-3 pt-2 flex-wrap border-t border-[#DCE3DA]/60">
        <button
          type="button"
          onClick={() => {
            setValue('title', 'Q4 Product Launch Announcement');
            setValue('body', sampleContent);
          }}
          className="text-xs font-semibold text-[#244C3A] hover:text-[#1B3B2D] transition-colors underline cursor-pointer"
        >
          Load test submission (with intentional violations)
        </button>

        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={loading}
          icon={<Sparkles size={15} />}
        >
          {loading ? 'Evaluating…' : 'Run Governance Analysis'}
        </Button>
      </div>
    </form>
  );
}
