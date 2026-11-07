import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import Select from '../common/Select.jsx';
import Textarea from '../common/Textarea.jsx';
import { GUIDELINE_SECTIONS } from '../../utils/constants.js';

export default function GuidelineForm({ isOpen, onClose, onSave, initialData, loading }) {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: initialData || {
      section: 'overview',
      title: '',
      content: '',
      items: [{ value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const onSubmit = (data) => {
    onSave({
      ...data,
      items: data.items.map((i) => (typeof i === 'string' ? i : i.value)).filter(Boolean),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Guideline Rule' : 'New Guideline Rule'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="button" size="sm" loading={loading} onClick={handleSubmit(onSubmit)}>
            {initialData ? 'Save Changes' : 'Create Guideline'}
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-left">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Section Category"
            options={GUIDELINE_SECTIONS}
            required
            error={errors.section?.message}
            {...register('section', { required: 'Section category is required' })}
          />
          <Input
            label="Guideline Title"
            placeholder="e.g. Approved Superlative Phrases"
            required
            error={errors.title?.message}
            {...register('title', { required: 'Title is required' })}
          />
        </div>

        <Textarea
          label="Scope & Intent Statement"
          placeholder="Clarify the governance standard and rationale for this rule…"
          rows={3}
          {...register('content')}
        />

        {/* Dynamic rule list */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-[#252B27] tracking-wide">
              Rule Items & Restrictions
            </label>
            <Button
              variant="secondary"
              size="xs"
              icon={<Plus size={12} />}
              onClick={() => append({ value: '' })}
              type="button"
            >
              Add Item
            </Button>
          </div>
          <div className="space-y-2">
            {fields.map((field, i) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  placeholder={`Specific rule statement #${i + 1}`}
                  className="flex-1"
                  {...register(`items.${i}.value`)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(i)}
                  type="button"
                  className="shrink-0 text-[#737B75] hover:text-[#962317] hover:bg-[#FDF2F2]"
                  aria-label="Remove rule item"
                >
                  <Trash2 size={13} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
