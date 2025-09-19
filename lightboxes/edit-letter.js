import { scheduleLetter } from 'backend/letters.jsw';
import wixWindow from 'wix-window';

let current;

$w.onReady(() => {
  current = wixWindow.lightbox.getContext(); // gets the itemData
  // populate fields
  $w('#title').value = current.title || '';
  $w('#body').value = current.body || '';
  $w('#recipientName').value = current.recipientName || '';
  $w('#recipientEmail').value = current.recipientEmail || '';
  $w('#deliverAt').value = current.deliverAt ? new Date(current.deliverAt) : null;
  $w('#consent').checked = !!current.consent;

  $w('#saveBtn').onClick(saveChanges);
});

async function saveChanges() {
  try {
    await scheduleLetter({
      _id: current._id,
      title: $w('#title').value,
      body: $w('#body').value,
      recipientName: $w('#recipientName').value,
      recipientEmail: $w('#recipientEmail').value,
      deliverAt: $w('#deliverAt').value,
      consent: $w('#consent').checked,
      senderName: current.senderName,
      senderEmail: current.senderEmail
    });
    wixWindow.lightbox.close({ refresh: true });
  } catch (e) {
    console.error(e);
    $w('#errorText').text = e.message || 'Update failed';
    $w('#errorText').show();
  }
}
