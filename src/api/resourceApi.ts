// Hämta alla bokningar (resources med Content som har id, name, email)
export async function findBookingResourceId({ resourceId, day, slot, name }: { resourceId: string; day: number; slot: string; name: string }): Promise<string | null> {
  const response = await fetch('https://localhost:5083/api/resources');
  if (!response.ok) throw new Error('Kunde inte hämta resurser');
  const resources = await response.json();
  for (const r of resources) {
    try {
      let content = JSON.parse(r.content);
      if (content && typeof content.content === 'string') {
        content = JSON.parse(content.content);
      }
      if (
        content.resourceId === resourceId &&
        content.day === day &&
        content.slot === slot &&
        (!name || content.name === name)
      ) {
        return r.id;
      }
    } catch {}
  }
  return null;
}

// Ta bort en bokning (DELETE)
export async function deleteBookingResource(id: string) {
  const response = await fetch(`https://localhost:5083/api/resources/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Kunde inte ta bort bokning');
}
// Uppdatera en resurs (PUT)
export async function updateResourceSlot({ id, content }: { id: string; content: string }) {
  // content ska redan vara en JSON-sträng, så vi gör INTE JSON.stringify(content) igen
  const response = await fetch(`https://localhost:5083/api/resources/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) throw new Error('Kunde inte uppdatera resurs');
  return await response.json();
}
// Rätt sätt att skapa en resurs/bokning:
export async function createResourceBooking(bookingObj: { [key: string]: any }) {
  // Gör ENDAST EN JSON.stringify!
  const content = JSON.stringify(bookingObj);
  // Skicka till backend
  const response = await fetch('https://localhost:5083/api/resources', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }), // content är en JSON-sträng, INTE en strängad sträng!
  });
  if (!response.ok) throw new Error('Kunde inte skapa bokning');
  return await response.json();
}

export async function fetchAllResources() {
  const response = await fetch('https://localhost:5083/api/resources');
  if (!response.ok) throw new Error('Kunde inte hämta resurser');
  return await response.json();
}

// Skicka verifieringsmail efter bokning
export async function sendBookingEmail({ to, subject, body }: { to: string; subject: string; body: string }) {
  const response = await fetch('https://localhost:5083/api/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subject, body }),
  });
  if (!response.ok) throw new Error('Kunde inte skicka e-post');
  return await response.json();
}
