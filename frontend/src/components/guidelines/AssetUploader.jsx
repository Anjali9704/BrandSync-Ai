import { useState, useRef } from 'react';
import { Upload, Trash2, Image, Palette, Type, File } from 'lucide-react';
import Button from '../common/Button.jsx';
import { uploadAsset, deleteAsset } from '../../services/guidelineService.js';
import toast from 'react-hot-toast';

const typeIcons = { logo: Image, colour: Palette, font: Type, other: File };

export default function AssetUploader({ assets = [], onAssetsChange }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('name', file.name.replace(/\.[^/.]+$/, ''));
      form.append('type', 'other');
      const asset = await uploadAsset(form);
      onAssetsChange?.([...assets, asset]);
      toast.success('Asset uploaded successfully');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (assetId) => {
    try {
      await deleteAsset(assetId);
      onAssetsChange?.(assets.filter((a) => (a.id || a._id) !== assetId));
      toast.success('Asset removed');
    } catch {
      toast.error('Failed to remove asset');
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-[#DCE3DA] hover:border-[#244C3A] rounded-lg p-7 text-center cursor-pointer transition-colors bg-[#F7F8F4]/50"
      >
        <div className="w-10 h-10 rounded-full bg-[#EBF2ED] text-[#244C3A] flex items-center justify-center mx-auto mb-2">
          <Upload size={18} />
        </div>
        <p className="text-xs font-semibold text-[#252B27]">Click to upload brand collateral</p>
        <p className="text-[11px] text-[#737B75] mt-0.5">Vector logos (.svg), Color swatches, TTF/OTF Typography sets</p>
        <input ref={fileRef} type="file" className="hidden" onChange={handleUpload} accept="image/*,.pdf,.zip,.ttf,.otf,.woff,.woff2" />
      </div>

      {/* Asset Cards */}
      {assets.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
          {assets.map((asset) => {
            const assetId = asset.id || asset._id;
            const Icon = typeIcons[asset.type] || typeIcons.other;
            const isColour = asset.type === 'colour' && asset.url?.startsWith('#');

            return (
              <div key={assetId} className="bg-white border border-[#DCE3DA] rounded-lg p-3 group relative shadow-xs hover:border-[#CBD4C8] transition-all">
                {isColour ? (
                  <div
                    className="w-full h-14 rounded border border-black/10 mb-2 shadow-xs"
                    style={{ backgroundColor: asset.url }}
                    aria-label={`Colour: ${asset.url}`}
                  />
                ) : (
                  <div className="w-full h-14 rounded mb-2 bg-[#F7F8F4] border border-[#DCE3DA] flex items-center justify-center">
                    <Icon size={20} className="text-[#244C3A]" />
                  </div>
                )}
                <p className="text-xs font-semibold text-[#252B27] truncate">{asset.name}</p>
                {isColour && <p className="text-[11px] text-[#737B75] font-mono mt-0.5">{asset.url}</p>}
                <span className="text-[10px] uppercase font-bold text-[#737B75] tracking-wider mt-1 block">
                  {asset.type}
                </span>

                <button
                  onClick={() => handleDelete(assetId)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded bg-[#FDF2F2] text-[#962317] border border-[#F6D0D0] hover:bg-[#FBE4E4] transition-all cursor-pointer"
                  aria-label={`Remove ${asset.name}`}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {uploading && (
        <p className="text-xs text-[#737B75] text-center">Uploading asset…</p>
      )}
    </div>
  );
}
