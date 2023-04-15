// ==UserScript==
// @name         Friend Request Decline Notification
// @version      1.0
// @description  Displays a notification when a friend request is declined
// @author       Your Name Here
// @namespace    https://yourdomain.com
// @homepage     https://yourdomain.com/friend-request-decline-notification
// @icon         https://yourdomain.com/icon.png
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// ==/UserScript==
//META{"name":"FriendRequestDeclineNotification"}*//

const { Plugin } = require('powercord/entities');
const { getModule } = require('powercord/webpack');
const { findInReactTree } = require('powercord/util');

class FriendRequestDeclineNotification extends Plugin {

  getName() {
    return "Friend Request Decline Notification";
  }

  getDescription() {
    return "Displays a notification when a friend request is declined";
  }

  getVersion() {
    return "1.0";
  }

  getAuthor() {
    return "Your Name Here";
  }

  start() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const declinedRequest = $(mutation.target).find('.pending-friends-list .friend-accept.declined');
        if (declinedRequest.length > 0) {
          const username = declinedRequest.closest('.friend-row').find('.friend-name').text().trim();
          const message = `${username} declined your friend request.`;
          const notification = $('<div>', {
            class: 'friend-request-declined-notification',
            text: message,
          });
          $('.chat').prepend(notification);
          setTimeout(() => {
            notification.fadeOut('slow', () => {
              notification.remove();
            });
          }, 5000);
        }
      });
    });

    observer.observe(document.querySelector('.chat'), {
      childList: true,
      subtree: true,
    });
  }

  stop() {
    $('.friend-request-declined-notification').remove();
  }

  unload() {
    this.stop();
  }
}