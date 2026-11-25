// Makes the given image the wallpaper on every screen, unless it already is.
// Prints "changed" or "unchanged" so Ansible can report accurately.
//
//   osascript -l JavaScript wallpaper.js /path/to/image.jpg

ObjC.import('AppKit');

function run(argv) {
  const wanted = $.NSURL.fileURLWithPath(argv[0]);
  const workspace = $.NSWorkspace.sharedWorkspace;
  const screens = $.NSScreen.screens;
  let changed = false;

  for (let i = 0; i < screens.count; i++) {
    const screen = screens.objectAtIndex(i);
    if (workspace.desktopImageURLForScreen(screen).path.js === wanted.path.js) continue;

    const ok = workspace.setDesktopImageURLForScreenOptionsError(wanted, screen, $.NSDictionary.dictionary, null);
    if (!ok) throw new Error('could not set wallpaper to ' + wanted.path.js);
    changed = true;
  }

  return changed ? 'changed' : 'unchanged';
}
