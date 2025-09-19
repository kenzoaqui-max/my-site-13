import { myLetters } from 'backend/letters.jsw';
import wixWindow from 'wix-window';

$w.onReady(async () => {
  const res = await myLetters();
  const items = res.items || [];
  $w('#lettersRepeater').data = items;

  $w('#lettersRepeater').onItemReady(($item, itemData) => {
    $item('#titleText').text = itemData.title || '(No title)';
    $item('#statusText').text = itemData.status;
    $item('#deliverText').text = itemData.deliverAt ? new Date(itemData.deliverAt).toLocaleString('en-PH', { timeZone: 'Asia/Manila' }) : '—';

    $item('#editBtn').onClick(async () => {
      const updated = await wixWindow.openLightbox('Edit Letter', itemData);
      if (updated?.refresh) {
        wixLocation.to(wixLocation.url); // simple refresh
      }
    });

    $item('#cancelBtn').onClick(async () => {
      // Optional: update status to 'canceled' (add code in letters.jsw if desired)
      // Or switch collection Delete permission to owner and call a delete function.
      wixWindow.openLightbox('Confirm', { message: 'Ask admin to cancel, or enable owner deletes.' });
    });
  });
});
