// Uppdatera en resurs (PUT)
export async function updateResourceSlot({ id, content }: { id: string; content: string }) {
  const response = await fetch(`https://localhost:5083/api/resources/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) throw new Error('Kunde inte uppdatera resurs');
  return await response.json();
}
export async function createResourceBooking({ id, name, email }: { id: number; name: string; email: string }) {
  const content = JSON.stringify({ id, name, email });
  const response = await fetch('https://localhost:5083/api/resources', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) throw new Error('Kunde inte skapa bokning');
  return await response.json();
}