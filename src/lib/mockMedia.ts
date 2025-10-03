const seedAssets = [
  {
    id: 'mock-hero-1',
    filename: 'venuevent-hero.png',
    url: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92eee?auto=format&fit=crop&w=1200&q=80',
    size: 350,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mock-hero-2',
    filename: 'aztlan-dashboard.png',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    size: 480,
    createdAt: new Date().toISOString(),
  },
];

let mediaAssets = [...seedAssets];

export const listMediaAssets = () => mediaAssets;

export const addMediaAsset = async (file: File) => {
  const reader = new FileReader();
  const dataUrl = await new Promise<string>((resolve) => {
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });

  const asset = {
    id: crypto.randomUUID(),
    filename: file.name,
    url: dataUrl,
    size: Math.round(file.size / 1024),
    createdAt: new Date().toISOString(),
  };
  mediaAssets = [asset, ...mediaAssets];
  return asset;
};
