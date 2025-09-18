// Hämta alla bokningar (resources med Content som har id, name, email)
export async function findBookingResourceId({ slotId, name, email }) {
    const response = await fetch('https://localhost:5083/api/resources');
    if (!response.ok)
        throw new Error('Kunde inte hämta resurser');
    const resources = await response.json();
    for (const r of resources) {
        try {
            const content = JSON.parse(r.content);
            if (content.id === slotId &&
                content.name === name &&
                content.email === email) {
                return r.id;
            }
        }
        catch { }
    }
    return null;
}
// Ta bort en bokning (DELETE)
export async function deleteBookingResource(id) {
    const response = await fetch(`https://localhost:5083/api/resources/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok)
        throw new Error('Kunde inte ta bort bokning');
}
// Uppdatera en resurs (PUT)
export async function updateResourceSlot({ id, content }) {
    // content ska redan vara en JSON-sträng, så vi gör INTE JSON.stringify(content) igen
    const response = await fetch(`https://localhost:5083/api/resources/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
    });
    if (!response.ok)
        throw new Error('Kunde inte uppdatera resurs');
    return await response.json();
}
// Rätt sätt att skapa en resurs/bokning:
export async function createResourceBooking({ resourceId, day, slot, name, email }) {
    // Skapa ett objekt
    const bookingObj = { resourceId, day, slot, name, email };
    // Gör ENDAST EN JSON.stringify!
    const content = JSON.stringify(bookingObj);
    // Skicka till backend
    const response = await fetch('https://localhost:5083/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }), // content är en JSON-sträng, INTE en strängad sträng!
    });
    if (!response.ok)
        throw new Error('Kunde inte skapa bokning');
    return await response.json();
}
export async function deleteBooking({ slotId, name, email }) {
    const response = await fetch('https://localhost:5083/api/resources/booking', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotId, name, email }),
    });
    if (!response.ok)
        throw new Error('Kunde inte avboka');
}
