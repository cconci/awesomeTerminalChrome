/**
 * Listens for the app launching, then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function(launchData) {
  chrome.app.window.create(
    'index.html',
    {
      id: 'mainWindow',
      bounds: {width: 680, height: 800}
    }
  );
});

chrome.runtime.onSuspend.addListener(function() { 
	// Do some simple clean-up tasks.
});

chrome.runtime.onInstalled.addListener(function() { 
		// chrome.storage.local.set(object items, function callback);
});