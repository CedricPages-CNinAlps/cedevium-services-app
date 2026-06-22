const UPLOAD_TOKEN = 'Ced3v1um-UPL-2025-9sKj';

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/upload.php', {
    method: 'POST',
    headers: { 'X-Upload-Token': UPLOAD_TOKEN },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur lors de l'upload");
  return data.url as string;
}
