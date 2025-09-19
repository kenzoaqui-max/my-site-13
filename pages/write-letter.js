import { saveDraft, scheduleLetter } from 'backend/letters.jsw';
import wixUsers from 'wix-users';

$w.onReady(() => {
  // Require login
  if (!wixUsers.currentUser.loggedIn) {
    wixUsers.promptLogin().then(() => wixLocation.to(wixLocation.url));
    return;
  }

  // Prevent past date selection
  const now = new Date();
  $w('#deliverAt').minDate = now;

  $w('#errorText').hide();
  $w('#successText').hide();

  $w('#saveDraftBtn').onClick(() => handleSave('draft'));
  $w('#scheduleBtn').onClick(() => handleSave('pending'));
});

function showError(msg) {
  $w('#errorText').text = msg;
  $w('#errorText').show();
  $w('#successText').hide();
}
function showSuccess(msg) {
  $w('#successText').text = msg;
  $w('#successText').show();
  $w('#errorText').hide();
}

async function handleSave(mode) {
  try {
    $w('#saveDraftBtn').disable();
    $w('#scheduleBtn').disable();

    const payload = {
      senderName: $w('#senderName').value?.trim(),
      senderEmail: $w('#senderEmail').value?.trim(),
      recipientName: $w('#recipientName').value?.trim(),
      recipientEmail: $w('#recipientEmail').value?.trim(),
      title: $w('#title').value?.trim(),
      body: $w('#body').value, // rich text HTML
      deliverAt: $w('#deliverAt').value, // Date object or null
      consent: $w('#consent').checked
    };

    if (mode === 'draft') {
      await saveDraft(payload);
      showSuccess('Draft saved.');
    } else {
      // Validate required fields for scheduling
      if (!payload.recipientEmail) return showError('Recipient email is required.');
      if (!payload.deliverAt) return showError('Choose a future delivery date & time.');
      if (new Date(payload.deliverAt).getTime() <= Date.now()) return showError('Delivery must be in the future.');
      if (!payload.consent) return showError('Please confirm consent.');
      await scheduleLetter(payload);
      showSuccess('Letter scheduled! It will be delivered on the date you chose.');
    }

    // Optionally clear the form
    // resetForm();

  } catch (e) {
    console.error(e);
    showError(e.message || 'Something went wrong.');
  } finally {
    $w('#saveDraftBtn').enable();
    $w('#scheduleBtn').enable();
  }
}

function resetForm() {
  [$w('#senderName'), $w('#senderEmail'), $w('#recipientName'), $w('#recipientEmail'), $w('#title')].forEach(i => i.value = '');
  $w('#body').value = '';
  $w('#deliverAt').value = null;
  $w('#consent').checked = false;
}
