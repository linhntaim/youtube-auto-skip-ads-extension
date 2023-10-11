# youtube-auto-skip-ads-extension

Help to automatically skip ads while playing videos on YouTube.

## Known about YouTube

### Ads

At [YouTube website](https://www.youtube.com), ads are shown while playing video
via Video Player.

There are 3 places that have Video Player:

- Watch Page.
- Channel Page.
- Mini-player Popup.

***Note:* **Shorts** is not supported yet, so we don't count on it.

There are 2 types of ad:

- Skippable: Use can click on a skip button that appears
  after the ad is played for a short time.
- Non-skippable: User must watch the whole ad.

### Website

What's behind YouTube website at https://www.youtube.com:

- An SPA: The `root` node is the `/html/body/ytd-app` node.
- Mini-player Popup node is the `/root/ytd-miniplayer` node.
- Any Page node is a child node of the `/root/div[id="content"]/ytd-page-manager` node.
- Watch Page node is a `ytd-watch-flexy` node while other Pages are `ytd-browse` nodes.
- Mini-player Popup node and Page nodes are static nodes which won't be removed
  after being already rendered while navigating from one page to another page.
- Video Player node is a `ytd-player` node that:
    - is rendered when a video is played.
    - can be placed inside:
        - the `ytd-watch-flexy` node of Watch Page
          or the `ytd-miniplayer` node of Mini-player Popup:
            - The `ytd-player` node is mainly placed inside the `ytd-watch-flexy` node.
            - When navigating from Watch Page to other Pages
              while a single video is being played,
              the `ytd-player` node will still be inside the `ytd-watch-flexy` node
              but its video source will stay empty.
            - When navigating from Watch Page to other Pages
              while a Playlist is being played.
              the `ytd-player` node will be moved to the `ytd-miniplayer` node.
            - When Mini-player Popup closes,
              the `ytd-player` node will be moved back from the `ytd-miniplayer` node
              to the `ytd-watch-flexy` node.
        - the `ytd-browse` node of Channel Page:
            - The `ytd-player` node inside this Page is to play the top video of the channel.
            - This node is different from the `ytd-player` node
              inside the `ytd-miniplayer`/`ytd-watch-flexy` node.
- Inside Video Player node, there are:
    - a `video[class="video-stream html5-main-video"]` node that plays videos,
      and also ad clips.
    - a `div[class="video-ads ytp-ad-module"]` node that contains ad elements
      while ad clips are being played:
        - Inside this node, there's the `div[class="ytp-ad-player-overlay-skip-or-preview"]` node
          which has one of following nodes:
            - a `div[class="ytp-ad-skip-ad-slot"]` node if a skippable ad is being played:
                - Inside this node, there's a `button[class="ytp-ad-skip-button ytp-button"]` node
                  to trigger the skip when clicked
                    - By default, this node's style has `display` be `none`
                      when the ad clip starts to play.
                    - After a short time, the style `display:none` is removed,
                      and the node appears for user to click.
            - a `div[class="ytp-ad-preview-slot"]` node if a non-skippable ad is being played.
