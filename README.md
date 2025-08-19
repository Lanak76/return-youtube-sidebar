# Return YouTube Sidebar

Keep YouTube’s sidebar fully expanded on the homepage, feed, search results, playlists, channels (including @username), Shorts, and Community posts. It does not affect watch pages and automatically disables itself.

## Installation

1. Install a userscript manager such as [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/).
2. Click "Create a new script" and paste the contents of `return-youtube-sidebar.user.js`.
3. Save the script and reload YouTube pages.

## Supported Paths

- `/` (Homepage)
- `/feed` (Subscriptions, History, etc.)
- `/results` (Search results)
- `/playlist` (Playlists)
- `/c/`, `/channel/`, `/user/`, `/@` (Channels)
- `/shorts/` (Shorts)
- `/post` (Community posts)

## Notes

- Automatically disables on watch pages.
- Works with modern YouTube layout.
- Non-malicious; does not block ads or modify content.
