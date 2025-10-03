import { useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';
import Button from '@/components/ui/Button';
import { useAdminMediaAssets, useUploadMediaAsset } from '@/features/admin/hooks/useAdminMedia';

export const AdminMediaLibraryPage = () => {
  const { data: assets = [], isLoading } = useAdminMediaAssets();
  const uploadMutation = useUploadMediaAsset();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '';
  const assetOrigin = useMemo(() => {
    try {
      return apiBaseUrl ? new URL(apiBaseUrl).origin : window.location.origin;
    } catch (error) {
      console.warn('Failed to parse VITE_API_BASE_URL', error);
      return window.location.origin;
    }
  }, [apiBaseUrl]);

  const resolveAssetUrl = useCallback(
    (url: string) => (url.startsWith('http') ? url : `${assetOrigin}${url.startsWith('/') ? url : `/${url}`}`),
    [assetOrigin],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      uploadMutation.mutate(file);
    },
    [uploadMutation],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ accept: { 'image/*': [] }, onDrop });

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-neutral-900">Media library</h1>
        <p className="text-sm text-neutral-500">
          Upload hero images, screenshots, and assets ready to embed in your posts.
        </p>
      </div>

      <div
        {...getRootProps()}
        className={clsx(
          'flex h-48 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-neutral-300 bg-white text-center transition-colors',
          isDragActive && 'border-accent bg-accent-soft/20 text-accent',
        )}
      >
        <input {...getInputProps()} />
        <p className="text-sm font-semibold text-neutral-700">Drop files here or browse</p>
        <p className="mt-2 text-xs text-neutral-500">PNG, JPG, HEIC up to 10MB</p>
        {uploadMutation.isPending ? <p className="mt-3 text-xs text-neutral-400">Uploading...</p> : null}
        {uploadMutation.isError ? (
          <p className="mt-3 text-xs text-red-500">Upload failed. Try again.</p>
        ) : null}
      </div>

      {isLoading ? (
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-10 text-sm text-neutral-500">
          Loading assets...
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {assets.map((asset) => {
            const assetUrl = resolveAssetUrl(asset.url);
            return (
            <div
              key={asset.id}
              className="overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-subtle/40"
            >
              <img src={assetUrl} alt={asset.filename} className="h-48 w-full object-cover" />
              <div className="flex items-center justify-between px-6 py-4 text-sm">
                <div>
                  <p className="font-semibold text-neutral-900">{asset.filename}</p>
                  <p className="text-xs text-neutral-500">{asset.size} KB</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(assetUrl)}
                  >
                    Copy URL
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => window.open(assetUrl, '_blank')}>
                    Open
                  </Button>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default AdminMediaLibraryPage;
