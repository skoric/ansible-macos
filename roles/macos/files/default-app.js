// Makes an app the default for a kind of file, unless it already is.
// Prints "changed" or "unchanged" so Ansible can report accurately.
//
//   osascript -l JavaScript default-app.js /Applications/Ghostty.app public.unix-executable

ObjC.import('AppKit');
ObjC.import('CoreServices');
ObjC.bindFunction('LSSetDefaultRoleHandlerForContentType', ['int', ['id', 'unsigned int', 'id']]);

// This framework cannot be imported by name, so load it and look its class up instead
$.NSBundle.bundleWithPath('/System/Library/Frameworks/UniformTypeIdentifiers.framework').load;

const ALL_ROLES = 0xFFFFFFFF;

function run(argv) {
  const app = $.NSURL.fileURLWithPath(argv[0]);
  const type = $.NSClassFromString('UTType').typeWithIdentifier(argv[1]);
  const workspace = $.NSWorkspace.sharedWorkspace;

  const isDefault = () => {
    const current = workspace.URLForApplicationToOpenContentType(type);
    return !current.isNil() && current.path.js === app.path.js;
  };

  if (isDefault()) return 'unchanged';

  const bundle = $.NSBundle.bundleWithURL(app);
  if (bundle.isNil()) throw new Error('app not found: ' + app.path.js);

  $.LSSetDefaultRoleHandlerForContentType($(argv[1]), ALL_ROLES, bundle.bundleIdentifier);

  // For some kinds of file, macOS first asks the user to confirm the change in a dialog.
  // Wait up to two minutes for that answer.
  for (let i = 0; i < 480 && !isDefault(); i++) delay(0.25);
  if (!isDefault()) throw new Error(app.path.js + ' was not made the default for ' + argv[1] + '. If macOS asked you to confirm, the change was declined or not answered within two minutes.');

  return 'changed';
}
