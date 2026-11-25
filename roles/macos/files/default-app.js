// Makes an app the default for a kind of file or a kind of link, unless it already is.
// Prints "changed" or "unchanged" so Ansible can report accurately.
//
//   osascript -l JavaScript default-app.js /Applications/Ghostty.app type public.unix-executable
//   osascript -l JavaScript default-app.js /Applications/Firefox.app scheme http

ObjC.import('AppKit');
ObjC.import('CoreServices');
ObjC.bindFunction('LSSetDefaultRoleHandlerForContentType', ['int', ['id', 'unsigned int', 'id']]);
ObjC.bindFunction('LSSetDefaultHandlerForURLScheme', ['int', ['id', 'id']]);

// This framework cannot be imported by name, so load it and look its class up instead
$.NSBundle.bundleWithPath('/System/Library/Frameworks/UniformTypeIdentifiers.framework').load;

const ALL_ROLES = 0xFFFFFFFF;

function run(argv) {
  const [appPath, kind, value] = argv;
  const app = $.NSURL.fileURLWithPath(appPath);
  const workspace = $.NSWorkspace.sharedWorkspace;

  let current, set;
  if (kind === 'type') {
    const type = $.NSClassFromString('UTType').typeWithIdentifier(value);
    current = () => workspace.URLForApplicationToOpenContentType(type);
    set = (bundleId) => $.LSSetDefaultRoleHandlerForContentType($(value), ALL_ROLES, bundleId);
  } else if (kind === 'scheme') {
    const link = $.NSURL.URLWithString(value + '://example.com');
    current = () => workspace.URLForApplicationToOpenURL(link);
    set = (bundleId) => $.LSSetDefaultHandlerForURLScheme($(value), bundleId);
  } else {
    throw new Error('second argument must be "type" or "scheme", got: ' + kind);
  }

  const isDefault = () => {
    const url = current();
    return !url.isNil() && url.path.js === app.path.js;
  };

  if (isDefault()) return 'unchanged';

  const bundle = $.NSBundle.bundleWithURL(app);
  if (bundle.isNil()) throw new Error('app not found: ' + app.path.js);

  set(bundle.bundleIdentifier);

  // For some kinds, macOS first asks the user to confirm the change in a dialog.
  // Wait up to two minutes for that answer.
  for (let i = 0; i < 480 && !isDefault(); i++) delay(0.25);
  if (!isDefault()) throw new Error(app.path.js + ' was not made the default for ' + value + '. If macOS asked you to confirm, the change was declined or not answered within two minutes.');

  return 'changed';
}
