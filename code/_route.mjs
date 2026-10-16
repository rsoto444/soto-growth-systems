// Shared by the page gates.
//
// Git Bash on Windows rewrites any command-line argument that starts with "/" into a Windows path, so
//     node code/check_page_done.mjs /blog/my-post/
// arrives as "C:/Program Files/Git/blog/my-post/". This undoes that, so the gates work the same from Git
// Bash, PowerShell, Command Prompt, macOS and Linux with no flags or workarounds.
//
// It strips a drive-letter prefix that ends in a "Git" folder (the usual install, a custom install, or the
// 32-bit one). A real route never starts with a drive letter, so nothing legitimate is changed.
export function cleanRoute(arg) {
  if (typeof arg !== "string") return arg;
  const m = /^[A-Za-z]:[\\/](?:[^\\/]+[\\/])*?Git(?:[\\/]usr)?(?=[\\/])(.*)$/.exec(arg);
  return m ? m[1].replace(/\\/g, "/") : arg;
}
